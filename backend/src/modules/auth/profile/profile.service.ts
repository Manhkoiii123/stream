import { ConflictException, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import * as Upload from 'graphql-upload/Upload.js'
import * as sharp from 'sharp'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { ChangeInfoInput } from '@/src/modules/auth/profile/inputs/change-info.input'
import {
	SocialLinkInput,
	SocialLinkOrderInput
} from '@/src/modules/auth/profile/inputs/social-link.input'
import { CloudinaryService } from '@/src/modules/libs/cloudinary/cloudinary.service'

@Injectable()
export class ProfileService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly cloudinaryService: CloudinaryService
	) {}

	public async changeAvatar(user: User, file: Upload) {
		if (user.avatar) {
			await this.cloudinaryService.deleteImage(user.avatar)
		}
		const chunks: Buffer[] = []
		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk)
		}
		const buffer = Buffer.concat(chunks)
		const fileName = `/channels/${user.username}.webp`

		let result
		if (file.filename && file.filename.endsWith('.gif')) {
			const processedBuffer = await sharp(buffer, { animated: true })
				.resize(512, 512)
				.webp()
				.toBuffer()
			result = await this.cloudinaryService.upload(
				processedBuffer,
				fileName,
				'image/webp'
			)
		} else {
			const processedBuffer = await sharp(buffer)
				.resize(512, 512)
				.webp()
				.toBuffer()
			result = await this.cloudinaryService.upload(
				processedBuffer,
				fileName,
				'image/webp'
			)
		}
		await this.prismaService.user.update({
			where: { id: user.id },
			data: { avatar: result.secure_url }
		})
		return true
	}

	public async removeAvatar(user: User) {
		if (user.avatar) {
			await this.cloudinaryService.deleteImage(user.avatar)
			await this.prismaService.user.update({
				where: { id: user.id },
				data: { avatar: null }
			})
		}
		return true
	}

	public async changeInfo(user: User, input: ChangeInfoInput) {
		const { displayName, username, bio } = input
		const usernameExists = await this.prismaService.user.findUnique({
			where: { username }
		})
		if (usernameExists && username !== user.username) {
			throw new ConflictException('Username is already taken')
		}
		await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				displayName,
				username,
				bio
			}
		})
		return true
	}

	public async findSocialLinks(user: User) {
		const socialLinks = await this.prismaService.socialLink.findMany({
			where: { userId: user.id },
			orderBy: { position: 'asc' }
		})
		return socialLinks
	}

	public async createSocialLink(user: User, input: SocialLinkInput) {
		const { title, url } = input
		const lastSocialLink = await this.prismaService.socialLink.findFirst({
			where: { userId: user.id },
			orderBy: { position: 'desc' }
		})
		const newPosition = lastSocialLink ? lastSocialLink.position + 1 : 1
		await this.prismaService.socialLink.create({
			data: {
				title,
				url,
				position: newPosition,
				user: {
					connect: { id: user.id }
				}
			}
		})
		return true
	}

	public async reorderSocialLinks(list: SocialLinkOrderInput[]) {
		if (list.length === 0) {
			return true
		}
		const updatePromises = list.map((item) =>
			this.prismaService.socialLink.update({
				where: { id: item.id },
				data: { position: item.position }
			})
		)
		await Promise.all(updatePromises)
		return true
	}
	public async updateSocialLink(id: string, input: SocialLinkInput) {
		const { title, url } = input
		await this.prismaService.socialLink.update({
			where: { id },
			data: { title, url }
		})
		return true
	}
	public async deleteSocialLink(id: string) {
		await this.prismaService.socialLink.delete({
			where: { id }
		})
		return true
	}
}
