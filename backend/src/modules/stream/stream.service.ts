import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Prisma, User } from '@prisma/client'
import * as Upload from 'graphql-upload/Upload.js'
import { AccessToken } from 'livekit-server-sdk'
import * as sharp from 'sharp'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { CloudinaryService } from '@/src/modules/libs/cloudinary/cloudinary.service'
import { ChangeStreamInfoInput } from '@/src/modules/stream/inputs/change-stream-info.input'
import { FiltersInput } from '@/src/modules/stream/inputs/filter.input'
import { GenerateStreamTokenInput } from '@/src/modules/stream/inputs/generate-stream-token.input'

@Injectable()
export class StreamService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly cloudinaryService: CloudinaryService,
		private readonly configService: ConfigService
	) {}

	public async findAll(input: FiltersInput = {}) {
		const { skip, searchTerm, take } = input
		const whereClause = searchTerm
			? this.findBySearchTermFilter(searchTerm)
			: undefined
		const streams = await this.prismaService.stream.findMany({
			take: take ?? 12,
			skip: skip ?? 0,
			where: {
				user: {
					isDeactivated: false
				},
				...whereClause
			},
			include: {
				user: true,
				category: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
		return streams
	}

	public async findRandom() {
		const total = await this.prismaService.stream.count({
			where: {
				user: {
					isDeactivated: false
				}
			}
		})
		const randomIndex = new Set<number>()
		while (randomIndex.size < 7) {
			const index = Math.floor(Math.random() * total)
			randomIndex.add(index)
		}
		const streams = await this.prismaService.stream.findMany({
			where: {
				user: {
					isDeactivated: false
				}
			},
			include: {
				user: true,
				category: true
			},
			take: total,
			skip: 0
		})
		return Array.from(randomIndex).map((index) => streams[index])
	}
	private findBySearchTermFilter(
		searchTerm: string
	): Prisma.StreamWhereInput {
		return {
			OR: [
				{
					title: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					user: {
						username: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				}
			]
		}
	}

	public async changeInfo(user: User, input: ChangeStreamInfoInput) {
		const { title, categoryId } = input
		await this.prismaService.stream.update({
			where: {
				userId: user.id
			},
			data: {
				title,
				category: {
					connect: {
						id: categoryId
					}
				}
			}
		})

		return true
	}

	public async changeThumbnail(user: User, file: Upload) {
		const stream = await this.findByUserId(user)
		if (stream?.thumbnailUrl) {
			await this.cloudinaryService.deleteImage(stream.thumbnailUrl)
		}
		const chunks: Buffer[] = []
		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk)
		}
		const buffer = Buffer.concat(chunks)
		const fileName = `/streams/${user.username}.webp`

		let result
		if (file.filename && file.filename.endsWith('.gif')) {
			const processedBuffer = await sharp(buffer, { animated: true })
				.resize(1280, 720)
				.webp()
				.toBuffer()
			result = await this.cloudinaryService.upload(
				processedBuffer,
				fileName,
				'image/webp'
			)
		} else {
			const processedBuffer = await sharp(buffer)
				.resize(1280, 720)
				.webp()
				.toBuffer()
			result = await this.cloudinaryService.upload(
				processedBuffer,
				fileName,
				'image/webp'
			)
		}
		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: { thumbnailUrl: result.secure_url }
		})
		return true
	}

	public async removeThumbnail(user: User) {
		const stream = await this.findByUserId(user)
		if (stream?.thumbnailUrl) {
			await this.cloudinaryService.deleteImage(stream.thumbnailUrl)
			await this.prismaService.stream.update({
				where: { userId: user.id },
				data: { thumbnailUrl: null }
			})
		}
		return true
	}

	private async findByUserId(user: User) {
		const stream = await this.prismaService.stream.findUnique({
			where: {
				userId: user.id
			}
		})
		return stream
	}

	public async generateStreamToken(input: GenerateStreamTokenInput) {
		const { userId, channelId } = input
		let self: { id: string; username: string }
		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId
			}
		})
		if (user) {
			self = { id: user.id, username: user.username }
		} else {
			self = {
				id: userId,
				username: `Guest ${Math.floor(Math.random() * 100000)}`
			}
		}
		const channel = await this.prismaService.user.findUnique({
			where: {
				id: channelId
			}
		})
		if (!channel) {
			throw new NotFoundException('Channel not found')
		}
		const isHost = self.id === channelId
		const token = new AccessToken(
			this.configService.getOrThrow<string>('LIVEKIT_API_KEY'),
			this.configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
			{
				identity: isHost ? `host-${self.id}` : `${self.id}`,
				name: self.username
			}
		)
		token.addGrant({
			room: channel.id,
			roomJoin: true,
			canPublish: false
		})
		return { token: token.toJwt() }
	}
}
