import { Injectable } from '@nestjs/common'
import {
	NotificationType,
	SponsorshipPlan,
	TokenType,
	User
} from '@prisma/client'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { ChangeNotificationSettingInput } from '@/src/modules/notification/inputs/change-notification-setting.input'
import { generateToken } from '@/src/shared/utils/generate-token.utils'

@Injectable()
export class NotificationService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findUnreadCount(user: User) {
		const count = await this.prismaService.notification.count({
			where: {
				userId: user.id,
				isRead: false
			}
		})
		return count
	}

	public async findByUser(user: User) {
		await this.prismaService.notification.updateMany({
			where: {
				userId: user.id,
				isRead: false
			},
			data: {
				isRead: true
			}
		})
		const notifications = await this.prismaService.notification.findMany({
			where: {
				userId: user.id
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
		return notifications
	}

	public async changeSettings(
		user: User,
		input: ChangeNotificationSettingInput
	) {
		const { siteNotifications, telegramNotifications } = input
		const notificationSettings =
			await this.prismaService.notificationSettings.upsert({
				where: {
					userId: user.id
				},
				update: {
					siteNotifications,
					telegramNotifications
				},
				create: {
					siteNotifications,
					telegramNotifications,
					user: {
						connect: {
							id: user.id
						}
					}
				},
				include: {
					user: true
				}
			})

		if (
			notificationSettings.telegramNotifications &&
			!notificationSettings.user.telegramId
		) {
			const telegramAuthToken = await generateToken(
				this.prismaService,
				user,
				TokenType.TELEGRAM_AUTH
			)
			return {
				notificationSettings,
				telegramAuthToken: telegramAuthToken.token
			}
		}
		if (
			!notificationSettings.telegramNotifications &&
			notificationSettings.user.telegramId
		) {
			await this.prismaService.user.update({
				where: {
					id: user.id
				},
				data: {
					telegramId: null
				}
			})
			return {
				notificationSettings
			}
		}
		return {
			notificationSettings
		}
	}

	public async createStreamStart(userId: string, channel: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b class='font-medium'>Don't miss it!</b><p>Join the stream on the channel <a href='/${channel.username}' class='font-semibold'>${channel.displayName}</a>.</p>`,
				type: NotificationType.STREAM_START,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
		return notification
	}
	public async createNewFollowing(userId: string, follower: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b class='font-medium'>New follower!</b><p><a href='/${follower.username}' class='font-semibold'>${follower.displayName}</a> started following you.</p>`,
				type: NotificationType.NEW_FOLLOWER,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
		return notification
	}

	public async createNewSponsorship(
		userId: string,
		plan: SponsorshipPlan,
		sponsor: User
	) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b class='font-medium'>New sponsorship!</b><p><a href='/${sponsor.username}' class='font-semibold'>${sponsor.displayName}</a> just subscribed to your channel with the <span class='font-semibold'>${plan.title}</span> plan.</p>`,
				type: NotificationType.NEW_SPONSORSHIP,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
		return notification
	}

	public async createEnableTwoFactor(userId: string) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b class='font-medium'>Secure your account!</b><p>Enable two-factor authentication in your account settings to increase your security level.</p>`,
				type: NotificationType.ENABLE_TWO_FACTOR,
				userId
			}
		})
		return notification
	}

	public async createVerifyChannel(userId: string) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b class='font-medium'>Congratulations!</b><p>Your channel has been verified, and a verified badge will now appear next to your channel.</p>`,
				type: NotificationType.VERIFIED_CHANNEL,
				userId
			}
		})
		return notification
	}
}
