import { Field, ObjectType } from '@nestjs/graphql'
import { Stream } from '@prisma/client'

import { UserModel } from '@/src/modules/auth/account/models/user.model'
import { CategoryModel } from '@/src/modules/category/models/category.model'
import { ChatModel } from '@/src/modules/chat/models/chat.model'

@ObjectType()
export class StreamModel implements Stream {
	@Field(() => String)
	id: string

	@Field(() => String)
	title: string

	@Field(() => String, { nullable: true })
	thumbnailUrl: string

	@Field(() => String, { nullable: true })
	ingressId: string

	@Field(() => String, { nullable: true })
	serverUrl: string

	@Field(() => String, { nullable: true })
	streamKey: string

	@Field(() => Boolean)
	isLive: boolean

	@Field(() => String)
	userId: string

	@Field(() => UserModel)
	user: UserModel

	@Field(() => CategoryModel)
	category: CategoryModel

	@Field(() => String)
	categoryId: string

	@Field(() => [ChatModel])
	chatMessages: ChatModel[]

	@Field(() => Boolean)
	isChatEnabled: boolean

	@Field(() => Boolean)
	isChatFollowersOnly: boolean

	@Field(() => Boolean)
	isChatPremiumFollowersOnly: boolean

	@Field(() => Date)
	createdAt: Date
	@Field(() => Date)
	updatedAt: Date
}
