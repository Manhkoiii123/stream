import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import type { Request } from 'express'
import { TOTP } from 'otpauth'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { RedisService } from '@/src/core/redis/redis.service'
import { VerificationService } from '@/src/modules/auth/verification/verification.service'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'

import { LoginInput } from './inputs/login.input'

@Injectable()
export class SessionService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly redisService: RedisService,
		private readonly verificationService: VerificationService
	) {}

	public async findByUser(req: Request) {
		const userId = req.session.userId
		if (!userId) {
			throw new NotFoundException('No active session found')
		}
		const sessionFolder =
			this.configService.getOrThrow<string>('SESSION_FOLDER')
		let cursor = '0'
		const keys: string[] = []
		do {
			const [nextCursor, foundKeys] = await this.redisService.scan(
				cursor,
				'MATCH',
				`${sessionFolder}*`,
				'COUNT',
				100
			)
			cursor = nextCursor
			keys.push(...foundKeys)
		} while (cursor !== '0')

		const userSessions: any[] = []
		if (!keys.length) {
			return userSessions
		}
		for (const key of keys) {
			const sessionData = await this.redisService.get(key)
			if (sessionData) {
				const session = JSON.parse(sessionData)
				if (session.userId === userId) {
					userSessions.push({
						...session,
						id: key.split(':')[1]
					})
				}
			}
		}
		userSessions.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() -
				new Date(a.createdAt).getTime()
		)
		return userSessions
	}

	public async findCurrent(req: Request) {
		const sessionId = req.session.id
		const sessionData = await this.redisService.get(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`
		)
		const session = sessionData ? JSON.parse(sessionData) : null
		return {
			...session,
			id: sessionId
		}
	}

	public async login(req: Request, input: LoginInput, userAgent: string) {
		const { login, password, pin } = input
		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [
					{ username: { equals: login } },
					{ email: { equals: login } }
				]
			}
		})
		if (!user) {
			throw new NotFoundException('Invalid login credentials')
		}
		const isValidPassword = await verify(user.password, password)
		if (!isValidPassword) {
			throw new NotFoundException('Invalid login credentials')
		}

		if (!user.isEmailVerified) {
			await this.verificationService.sendVerificationToken(user)
			throw new BadRequestException(
				'Email not verified. A new verification email has been sent.'
			)
		}

		if (user.isTotpEnabled) {
			if (!pin) {
				return {
					message: 'TOTP code required'
				}
			}
			const totp = new TOTP({
				issuer: 'StreamApp',
				label: `${user.email}`,
				algorithm: 'SHA1',
				digits: 6,
				secret: user.totpSecret!
			})
			const delta = totp.validate({ token: pin })
			if (delta === null) {
				throw new BadRequestException('Invalid TOTP code')
			}
		}
		const metadata = getSessionMetadata(req, userAgent)
		return new Promise((resolver, reject) => {
			req.session.userId = user.id
			req.session.createdAt = new Date()
			req.session.metadata = metadata

			req.session.save((err) => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Failed to save session'
						)
					)
				}
				resolver({ user })
			})
		})
	}

	public async logout(req: Request) {
		return new Promise((resolver, reject) => {
			req.session.destroy((err) => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Failed to destroy session'
						)
					)
				}
				req.res?.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME')
				)
				resolver({ message: 'Logged out successfully' })
			})
		})
	}
	public async clearSessions(req: Request) {
		req.res?.clearCookie(
			this.configService.getOrThrow<string>('SESSION_NAME')
		)
		return true
	}
	public async remove(req: Request, id: string) {
		if (req.session.id === id) {
			throw new ConflictException(
				'Cannot remove the current active session'
			)
		}
		await this.redisService.del(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`
		)
		return true
	}
}
