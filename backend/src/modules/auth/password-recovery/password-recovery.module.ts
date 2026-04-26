import { Module } from '@nestjs/common'

import { MailModule } from '@/src/modules/libs/mail/mail.module'

import { PasswordRecoveryResolver } from './password-recovery.resolver'
import { PasswordRecoveryService } from './password-recovery.service'

@Module({
	providers: [PasswordRecoveryResolver, PasswordRecoveryService],
	imports: [MailModule]
})
export class PasswordRecoveryModule {}
