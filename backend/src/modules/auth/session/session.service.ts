import {
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import type { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { LoginInput } from './inputs/login.input'

@Injectable()
export class SessionService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService
	) {}

	public async login(req: Request, input: LoginInput) {
		const { login, password } = input
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
		return new Promise((resolver, reject) => {
			req.session.userId = user.id
			req.session.createdAt = new Date()

			req.session.save((err) => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Failed to save session'
						)
					)
				}
				resolver(user)
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
}
