import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

import { PasswordResetTemplate } from '@/src/modules/libs/mail/templates/password-reset.template'
import { VerificationTemplate } from '@/src/modules/libs/mail/templates/verification.template'
import { SessionMetadata } from '@/src/shared/types/session-metadata.types'

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	public async sendVerificationToken(email: string, token: string) {
		const domain =
			this.configService.get<string>('ALLOWED_DOMAIN') ||
			'http://localhost:3000'

		const html = await render(VerificationTemplate({ domain, token }))
		return this.sendMail(email, 'Verify your Stream account', html)
	}
	public async sendPasswordRecoveryToken(
		email: string,
		token: string,
		metadata: SessionMetadata
	) {
		const domain =
			this.configService.get<string>('ALLOWED_DOMAIN') ||
			'http://localhost:3000'

		const html = await render(
			PasswordResetTemplate({ domain, token, metadata })
		)
		return this.sendMail(email, 'Reset your Stream password', html)
	}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html
		})
	}
}
