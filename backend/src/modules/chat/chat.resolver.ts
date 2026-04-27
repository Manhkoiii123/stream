/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { User } from '@prisma/client'
import { PubSub } from 'graphql-subscriptions'

import { ChangeChatSettingsInput } from '@/src/modules/chat/inputs/change-chat-setting.input'
import { SendMessageInput } from '@/src/modules/chat/inputs/send-message.input'
import { ChatModel } from '@/src/modules/chat/models/chat.model'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { ChatService } from './chat.service'

@Resolver('Chat')
export class ChatResolver {
	private readonly pubsub: PubSub
	constructor(private readonly chatService: ChatService) {
		this.pubsub = new PubSub()
	}

	@Query(() => [ChatModel], { name: 'findMessagesByStream' })
	public async findMessagesByStream(@Args('streamId') streamId: string) {
		return this.chatService.findMessagesByStream(streamId)
	}
	@Subscription(() => ChatModel, {
		name: 'chatMessageAdded',
		filter: (payload, variables) =>
			payload.chatMessageAdded.streamId === variables.streamId
	})
	public chatMessageAdded(@Args('streamId') streamId: string) {
		return this.pubsub.asyncIterableIterator('CHAT_MESSAGE_ADDED')
	}

	@Authorization()
	@Mutation(() => ChatModel, { name: 'sendChatMessage' })
	public async sendMessage(
		@Authorized('id') userId: string,
		@Args('data') input: SendMessageInput
	) {
		const message = await this.chatService.sendMessage(userId, input)
		this.pubsub.publish('CHAT_MESSAGE_ADDED', {
			chatMessageAdded: message
		})
		return message
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeChatSettings' })
	public async changeSettings(
		@Authorized() user: User,
		@Args('data') input: ChangeChatSettingsInput
	) {
		return this.chatService.changeSettings(user, input)
	}
}
