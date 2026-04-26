import { Injectable, NotAcceptableException } from '@nestjs/common'
import { TokenType } from '@prisma/client'
import { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.utils'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'

import { MailService } from '../../libs/mail/mail.service'

import { ResetPasswordInput } from './inputs/reset-password.input'

@Injectable()
export class PasswordRecoveryService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	public async resetPassword(
		req: Request,
		input: ResetPasswordInput,
		userAgent: string
	) {
		const { email } = input
		const user = await this.prismaService.user.findUnique({
			where: { email }
		})
		if (!user) {
			throw new NotAcceptableException(
				'User with this email does not exist'
			)
		}
		const resetToken = await generateToken(
			this.prismaService,
			user,
			TokenType.PASSWORD_RESET
		)
		const metadata = getSessionMetadata(req, userAgent)
		await this.mailService.sendPasswordRecoveryToken(
			'manhtranduc0202@gmail.com',
			resetToken.token,
			metadata
		)
		return true
	}
}
