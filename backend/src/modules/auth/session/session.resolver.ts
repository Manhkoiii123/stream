import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { GplContext } from '@/src/shared/types/gpl-context.types'

import { UserModel } from '../account/models/user.model'

import { LoginInput } from './inputs/login.input'
import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}

	@Mutation(() => UserModel, { name: 'login' })
	public async login(
		@Context() { req }: GplContext,
		@Args('data') input: LoginInput
	) {
		return this.sessionService.login(req, input)
	}

	@Mutation(() => Boolean, { name: 'logout' })
	public async logout(@Context() { req }: GplContext) {
		return this.sessionService.logout(req)
	}
}
