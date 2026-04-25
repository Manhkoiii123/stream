import { MailerModule } from '@nestjs-modules/mailer'
import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { getMailerConfig } from '@/src/core/config/mailer.config'

import { MailService } from './mail.service'

@Global()
@Module({
	providers: [MailService],
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigModule],
			useFactory: getMailerConfig
		})
	],
	exports: [MailService]
})
export class MailModule {}
