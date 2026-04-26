import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TokenType, User } from '@prisma/client'
import { verify } from 'argon2'
import { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { DeactivateInput } from '@/src/modules/auth/deactivate/inputs/deactivate.input'
import { MailService } from '@/src/modules/libs/mail/mail.service'
import { generateToken } from '@/src/shared/utils/generate-token.utils'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'
import { destroySession } from '@/src/shared/utils/session.utils'

@Injectable()
export class DeactivateService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly mailService: MailService
	) {}

	public async deactivateAccount(
		req: Request,
		input: DeactivateInput,
		user: User,
		userAgent: string
	) {
		const { email, password, pin } = input
		if (user.email !== email) {
			throw new BadRequestException(
				'Email does not match the logged in user'
			)
		}
		const isvalidPassword = await verify(user.password, password)
		if (!isvalidPassword) {
			throw new BadRequestException('Invalid credentials')
		}
		if (!pin) {
			await this.sendDeactivationEmail(req, user, userAgent)
			return {
				message:
					'Deactivation email sent. Please check your inbox to confirm account deactivation.'
			}
		}
		await this.validateDeactivationToken(req, pin)

		return { user }
	}

	private async validateDeactivationToken(req: Request, token: string) {
		const existingToken = await this.prismaService.token.findUnique({
			where: { token, type: TokenType.DEACTIVATION },
			include: { user: true }
		})
		if (!existingToken) {
			throw new NotFoundException('Verification token not found')
		}
		const hasExpired = new Date(existingToken.expiresIn) < new Date()
		if (hasExpired) {
			throw new BadRequestException('Verification token has expired')
		}
		if (!existingToken.userId) {
			throw new NotFoundException('User ID not found')
		}
		await this.prismaService.user.update({
			where: { id: existingToken.userId },
			data: { isDeactivated: true, deactivatedAt: new Date() }
		})
		await this.prismaService.token.delete({
			where: { id: existingToken.id, type: TokenType.DEACTIVATION }
		})
		return destroySession(req, this.configService)
	}

	public async sendDeactivationEmail(
		req: Request,
		user: User,
		userAgent: string
	) {
		const deactivationToken = await generateToken(
			this.prismaService,
			user,
			TokenType.DEACTIVATION,
			false
		)

		const metadata = getSessionMetadata(req, userAgent)
		await this.mailService.sendDeactivateToken(
			'manhtranduc0202@gmail.com',
			deactivationToken.token,
			metadata
		)
		return true
	}
}
