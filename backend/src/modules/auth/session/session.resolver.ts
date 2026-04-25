import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'
import { GplContext } from '@/src/shared/types/gpl-context.types'

import { UserModel } from '../account/models/user.model'

import { LoginInput } from './inputs/login.input'
import { SessionModel } from './models/session.model'
import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}

	@Authorization()
	@Query(() => [SessionModel], { name: 'findSessionsByUser' })
	public async findByUser(@Context() { req }: GplContext) {
		return this.sessionService.findByUser(req)
	}
	@Authorization()
	@Query(() => SessionModel, { name: 'findCurrentSession' })
	public async findCurrent(@Context() { req }: GplContext) {
		return this.sessionService.findCurrent(req)
	}

	@Mutation(() => UserModel, { name: 'login' })
	public async login(
		@Context() { req }: GplContext,
		@Args('data') input: LoginInput,
		@UserAgent() userAgent: string
	) {
		return this.sessionService.login(req, input, userAgent)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'logout' })
	public async logout(@Context() { req }: GplContext) {
		return this.sessionService.logout(req)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'clearSessions' })
	public async clearSessions(@Context() { req }: GplContext) {
		return this.sessionService.clearSessions(req)
	}
	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSession' })
	public async removeSession(
		@Context() { req }: GplContext,
		@Args('id') id: string
	) {
		return this.sessionService.remove(req, id)
	}
}
