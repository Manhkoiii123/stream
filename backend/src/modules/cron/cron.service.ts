import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { MailService } from '@/src/modules/libs/mail/mail.service'

@Injectable()
export class CronService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	@Cron('0 0 * * *')
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
}
