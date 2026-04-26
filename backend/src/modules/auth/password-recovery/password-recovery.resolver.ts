import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { ResetPasswordInput } from '@/src/modules/auth/password-recovery/inputs/reset-password.input'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'
import { GplContext } from '@/src/shared/types/gpl-context.types'

import { PasswordRecoveryService } from './password-recovery.service'

@Resolver('PasswordRecovery')
export class PasswordRecoveryResolver {
	public constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService
	) {}
	@Mutation(() => Boolean, { name: 'resetPassword' })
	public async resetPassword(
		@Args('data') input: ResetPasswordInput,
		@Context() { req }: GplContext,
		@UserAgent() userAgent: string
	) {
		return this.passwordRecoveryService.resetPassword(req, input, userAgent)
	}
}
