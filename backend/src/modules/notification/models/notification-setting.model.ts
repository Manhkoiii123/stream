import { Field, ObjectType } from '@nestjs/graphql'
import { NotificationSettings } from '@prisma/client'

import { UserModel } from '@/src/modules/auth/account/models/user.model'

@ObjectType()
export class NotificationSettingsModel implements NotificationSettings {
	@Field(() => String)
	id: string

	@Field(() => Boolean)
	siteNotifications: boolean

	@Field(() => Boolean)
	telegramNotifications: boolean

	@Field(() => UserModel)
	user: UserModel

	@Field(() => String)
	userId: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}

@ObjectType()
export class ChangeNotificationsSettingsResponse {
	@Field(() => NotificationSettingsModel)
	public notificationSettings: NotificationSettingsModel

	@Field(() => String, { nullable: true })
	public telegramAuthToken?: string
}
