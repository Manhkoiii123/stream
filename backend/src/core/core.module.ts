import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { getLiveKitConfig } from '@/src/core/config/livekit.config'
import { DeactivateModule } from '@/src/modules/auth/deactivate/deactivate.module'
import { ProfileModule } from '@/src/modules/auth/profile/profile.module'
import { CronModule } from '@/src/modules/cron/cron.module'
import { LivekitModule } from '@/src/modules/libs/livekit/livekit.module'
import { StreamModule } from '@/src/modules/stream/stream.module'

import { AccountModule } from '../modules/auth/account/account.module'
import { PasswordRecoveryModule } from '../modules/auth/password-recovery/password-recovery.module'
import { SessionModule } from '../modules/auth/session/session.module'
import { TotpModule } from '../modules/auth/totp/totp.module'
import { VerificationModule } from '../modules/auth/verification/verification.module'
import { CloudinaryModule } from '../modules/libs/cloudinary/cloudinary.module'
import { MailModule } from '../modules/libs/mail/mail.module'
import { IS_DEV_ENV } from '../shared/utils/is-dev.util'

import { getGraphQLConfig } from './config/graphql.config'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			imports: [ConfigModule],
			useFactory: getGraphQLConfig,
			inject: [ConfigService]
		}),
		PrismaModule,
		RedisModule,
		AccountModule,
		SessionModule,
		VerificationModule,
		MailModule,
		CloudinaryModule,
		PasswordRecoveryModule,
		TotpModule,
		DeactivateModule,
		CronModule,
		ProfileModule,
		StreamModule,
		LivekitModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getLiveKitConfig,
			inject: [ConfigService]
		})
	],
	controllers: [],
	providers: []
})
export class CoreModule {}
