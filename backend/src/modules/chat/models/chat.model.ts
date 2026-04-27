import { Field, ObjectType } from '@nestjs/graphql'
import { ChatMessage } from '@prisma/client'

import { UserModel } from '@/src/modules/auth/account/models/user.model'
import { StreamModel } from '@/src/modules/stream/models/stream.model'

@ObjectType()
export class ChatModel implements ChatMessage {
	@Field(() => String)
	id: string

	@Field(() => String)
	text: string

	@Field(() => UserModel)
	user: UserModel
	@Field(() => StreamModel)
	stream: StreamModel
	@Field(() => String)
	streamId: string
	@Field(() => String)
	userId: string

	@Field(() => Date)
	createdAt: Date
	@Field(() => Date)
	updatedAt: Date
}
