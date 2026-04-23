import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'
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
		@Args('data') input: LoginInput,
		@UserAgent() userAgent: string
	) {
		return this.sessionService.login(req, input, userAgent)
	}

	@Mutation(() => Boolean, { name: 'logout' })
	public async logout(@Context() { req }: GplContext) {
		return this.sessionService.logout(req)
	}
}
