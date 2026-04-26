import { ConflictException, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { hash, verify } from 'argon2'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { ChangeEmailInput } from '@/src/modules/auth/account/inputs/change-email.input'
import { ChangePasswordInput } from '@/src/modules/auth/account/inputs/change-password.input'
import { VerificationService } from '@/src/modules/auth/verification/verification.service'

import { CreateUserInput } from './inputs/create-user.input'

@Injectable()
export class AccountService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly verificationService: VerificationService
	) {}

	public async me(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			},
			include: {
				socialLinks: true
			}
		})
		return user
	}

	public async findAll() {
		const users = await this.prismaService.user.findMany()
		return users
	}
	public async create(input: CreateUserInput) {
		const { email, password, username } = input
		const isUsernameExists = await this.prismaService.user.findUnique({
			where: {
				username
			}
		})
		if (isUsernameExists) {
			throw new ConflictException('Username already exists')
		}
		const isEmailExists = await this.prismaService.user.findUnique({
			where: {
				email
			}
		})
		if (isEmailExists) {
			throw new ConflictException('Email already exists')
		}
		const user = await this.prismaService.user.create({
			data: {
				email,
				password: await hash(password),
				username,
				displayName: username
			}
		})
		await this.verificationService.sendVerificationToken(user)
		return user
	}

	public async changeEmail(user: User, input: ChangeEmailInput) {
		const { email } = input
		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				email
			}
		})
		return true
	}
	public async changePassword(user: User, input: ChangePasswordInput) {
		const { newPassword, oldPassword } = input
		const isValidPassword = await verify(user.password, oldPassword)
		if (!isValidPassword) {
			throw new ConflictException('Current password is incorrect')
		}
		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				password: await hash(newPassword)
			}
		})
		return true
	}
}
