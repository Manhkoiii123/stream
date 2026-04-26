import { Injectable, NotAcceptableException } from '@nestjs/common'
import { TokenType } from '@prisma/client'
import { hash } from 'argon2'
import { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { NewPasswordInput } from '@/src/modules/auth/password-recovery/inputs/new-password.input'
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
	public async newPassword(input: NewPasswordInput) {
		const { password, token } = input
		const existingToken = await this.prismaService.token.findUnique({
			where: { token, type: TokenType.PASSWORD_RESET }
		})
		if (!existingToken) {
			throw new NotAcceptableException('Invalid or expired token')
		}
		const hasExpired = new Date(existingToken.expiresIn) < new Date()
		if (hasExpired) {
			throw new NotAcceptableException('Token has expired')
		}
		if (!existingToken.userId) {
			throw new NotAcceptableException(
				"Token doesn't have an associated user"
			)
		}
		const user = await this.prismaService.user.findUnique({
			where: { id: existingToken.userId }
		})
		if (!user) {
			throw new NotAcceptableException('User not found')
		}
		await this.prismaService.user.update({
			where: { id: user.id },
			data: { password: await hash(password) }
		})
		await this.prismaService.token.delete({
			where: { id: existingToken.id, type: TokenType.PASSWORD_RESET }
		})
		return true
	}
}
