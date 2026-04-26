import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { User } from '@prisma/client'

import { AuthModel } from '@/src/modules/auth/account/models/auth.model'
import { DeactivateInput } from '@/src/modules/auth/deactivate/inputs/deactivate.input'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'
import { GplContext } from '@/src/shared/types/gpl-context.types'

import { DeactivateService } from './deactivate.service'

@Resolver('Deactivate')
export class DeactivateResolver {
	constructor(private readonly deactivateService: DeactivateService) {}

	@Authorization()
	@Mutation(() => AuthModel, { name: 'deactivateAccount' })
	public async deactivate(
		@Context() { req }: GplContext,
		@Args('data') input: DeactivateInput,
		@Authorized() user: User,
		@UserAgent() userAgent: string
	) {
		return this.deactivateService.deactivateAccount(
			req,
			input,
			user,
			userAgent
		)
	}
}
