import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TelegrafModule } from 'nestjs-telegraf'

import { getTelegramConfig } from '@/src/core/config/telegram.config'

import { TelegramService } from './telegram.service'

@Module({
	providers: [TelegramService],
	imports: [
		TelegrafModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getTelegramConfig,
			inject: [ConfigService]
		})
	]
})
export class TelegramModule {}
