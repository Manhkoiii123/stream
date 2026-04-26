import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from '@prisma/client'

import { ChangeEmailInput } from '@/src/modules/auth/account/inputs/change-email.input'
import { ChangePasswordInput } from '@/src/modules/auth/account/inputs/change-password.input'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { AccountService } from './account.service'
import { CreateUserInput } from './inputs/create-user.input'
import { UserModel } from './models/user.model'

@Resolver('Account')
export class AccountResolver {
	public constructor(private readonly accountService: AccountService) {}

	@Authorization()
	@Query(() => UserModel, { name: 'findProfile' })
	public async me(@Authorized('id') id: string) {
		return await this.accountService.me(id)
	}
	@Query(() => [UserModel], { name: 'findAllUsers' })
	public async findAll() {
		return await this.accountService.findAll()
	}
	@Mutation(() => UserModel, { name: 'createUser' })
	public async create(@Args('data') input: CreateUserInput) {
		return await this.accountService.create(input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeEmail' })
	public async changeEmail(
		@Authorized() user: User,
		@Args('data') input: ChangeEmailInput
	) {
		return await this.accountService.changeEmail(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changePassword' })
	public async changePassword(
		@Authorized() user: User,
		@Args('data') input: ChangePasswordInput
	) {
		return await this.accountService.changePassword(user, input)
	}
}
