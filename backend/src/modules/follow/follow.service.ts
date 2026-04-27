import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { User } from '@prisma/client'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { NotificationService } from '../notification/notification.service'

@Injectable()
export class FollowService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly notificationService: NotificationService
	) {}

	public async findMyFollowers(user: User) {
		const followers = await this.prismaService.follow.findMany({
			where: {
				followingId: user.id
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				follower: true
			}
		})
		return followers
	}

	public async findMyFollowings(user: User) {
		const followings = await this.prismaService.follow.findMany({
			where: {
				followerId: user.id
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				following: true
			}
		})
		return followings
	}

	public async follow(user: User, channelId: string) {
		const channel = await this.prismaService.user.findUnique({
			where: {
				id: channelId
			}
		})
		if (!channel) {
			throw new NotFoundException('Channel not found')
		}
		if (channel.id === user.id) {
			throw new ConflictException('You cannot follow yourself')
		}
		const existingFollow = await this.prismaService.follow.findFirst({
			where: {
				followingId: channel.id,
				followerId: user.id
			}
		})
		if (existingFollow) {
			throw new ConflictException(
				'You are already following this channel'
			)
		}
		const follow = await this.prismaService.follow.create({
			data: {
				followingId: channel.id,
				followerId: user.id
			},
			include: {
				following: {
					include: {
						notificationSettings: true
					}
				},
				follower: true
			}
		})

		if (follow.following.notificationSettings?.siteNotifications) {
			await this.notificationService.createNewFollowing(
				follow.following.id,
				follow.follower
			)
		}
		return true
	}
	public async unFollow(user: User, channelId: string) {
		const channel = await this.prismaService.user.findUnique({
			where: {
				id: channelId
			}
		})
		if (!channel) {
			throw new NotFoundException('Channel not found')
		}
		if (channel.id === user.id) {
			throw new ConflictException('You cannot follow yourself')
		}
		const existingFollow = await this.prismaService.follow.findFirst({
			where: {
				followingId: channel.id,
				followerId: user.id
			}
		})
		if (!existingFollow) {
			throw new NotFoundException('You are not following this channel')
		}
		await this.prismaService.follow.delete({
			where: {
				id: existingFollow.id,
				followingId: channel.id,
				followerId: user.id
			}
		})
		return true
	}
}
