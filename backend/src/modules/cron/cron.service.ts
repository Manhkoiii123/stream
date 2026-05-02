import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { CloudinaryService } from '@/src/modules/libs/cloudinary/cloudinary.service'
import { MailService } from '@/src/modules/libs/mail/mail.service'
import { NotificationService } from '@/src/modules/notification/notification.service'

@Injectable()
export class CronService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly cloudinaryService: CloudinaryService,
		private readonly notificationService: NotificationService
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_1AM)
	public async deleteDeactivatedAccounts() {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7) // 7 days ago

		const deacticvatedAccounts = await this.prismaService.user.findMany({
			where: {
				isDeactivated: true,
				deactivatedAt: {
					lte: sevenDaysAgo
				}
			}
		})
		for (const account of deacticvatedAccounts) {
			await this.mailService.sendAccountDeletionConfirmation(
				account.email
			)
			if (account.avatar) {
				await this.cloudinaryService.deleteImage(account.avatar)
			}
		}
		await this.prismaService.user.deleteMany({
			where: {
				isDeactivated: true,
				deactivatedAt: {
					lte: sevenDaysAgo
				}
			}
		})
	}
	@Cron(CronExpression.EVERY_DAY_AT_1AM)
	public async notifyUsersEnableTwoFactor() {
		const users = await this.prismaService.user.findMany({
			where: {
				id: '',
				isTotpEnabled: false
			},
			include: {
				notificationSettings: true
			}
		})
		for (const user of users) {
			await this.mailService.sendEnableTwoFactorToken(user.email)
			if (user.notificationSettings?.siteNotifications) {
				await this.notificationService.createEnableTwoFactor(user.id)
			}
		}
	}

	@Cron(CronExpression.EVERY_DAY_AT_1AM)
	public async verifyChannels() {
		const users = await this.prismaService.user.findMany({
			include: {
				notificationSettings: true
			}
		})

		for (const user of users) {
			const followersCount = await this.prismaService.follow.count({
				where: {
					followingId: user.id
				}
			})
			if (followersCount >= 10 && !user.isVerified) {
				await this.prismaService.user.update({
					where: {
						id: user.id
					},
					data: {
						isVerified: true
					}
				})
				await this.mailService.sendVerifyChannel(user.email)

				if (user.notificationSettings?.siteNotifications) {
					await this.notificationService.createVerifyChannel(user.id)
				}
			}
		}
	}

	@Cron(CronExpression.EVERY_DAY_AT_1AM)
	public async deleteOldNotifications() {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7) // 7 days ago
		await this.prismaService.notification.deleteMany({
			where: {
				createdAt: {
					lte: sevenDaysAgo
				}
			}
		})
	}
}
