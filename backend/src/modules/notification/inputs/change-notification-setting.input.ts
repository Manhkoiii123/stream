import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean } from 'class-validator'

@InputType()
export class ChangeNotificationSettingInput {
	@Field(() => Boolean)
	@IsBoolean()
	public siteNotifications: boolean

	@Field(() => Boolean)
	@IsBoolean()
	public telegramNotifications: boolean
}
