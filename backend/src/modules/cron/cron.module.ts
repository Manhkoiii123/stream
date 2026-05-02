import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { NotificationService } from '@/src/modules/notification/notification.service'

import { CronService } from './cron.service'

@Module({
	providers: [CronService, NotificationService],
	imports: [ScheduleModule.forRoot()]
})
export class CronModule {}
