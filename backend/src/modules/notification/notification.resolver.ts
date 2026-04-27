import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from '@prisma/client'

import { ChangeNotificationsSettingsResponse } from '@/src/modules/notification/models/notification-setting.model'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { ChangeNotificationSettingInput } from './inputs/change-notification-setting.input'
import { NotificationModel } from './models/notification.model'
import { NotificationService } from './notification.service'

@Resolver('Notification')
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	@Authorization()
	@Query(() => Number, { name: 'findUnreadNotificationsCount' })
	public async findUnreadCount(@Authorized() user: User) {
		return this.notificationService.findUnreadCount(user)
	}

	@Authorization()
	@Query(() => [NotificationModel], { name: 'findNotificationsByUser' })
	public async findByUser(@Authorized() user: User) {
		return this.notificationService.findByUser(user)
	}

	@Authorization()
	@Mutation(() => ChangeNotificationsSettingsResponse, {
		name: 'changeNotificationSettings'
	})
	public async changeSettings(
		@Authorized() user: User,
		@Args('data') input: ChangeNotificationSettingInput
	) {
		return this.notificationService.changeSettings(user, input)
	}
}
