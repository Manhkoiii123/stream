import { Args, Query, Resolver } from '@nestjs/graphql'

import { UserModel } from '@/src/modules/auth/account/models/user.model'

import { ChannelsService } from './channels.service'

@Resolver('Channel')
export class ChannelsResolver {
	constructor(private readonly channelsService: ChannelsService) {}

	@Query(() => [UserModel], { name: 'findRecommendedChannels' })
	public async findRecommendedChannels() {
		return this.channelsService.findRecommendedChannels()
	}

	@Query(() => UserModel, { name: 'findChannelByUsername' })
	public async findByUsername(@Args('username') username: string) {
		return this.channelsService.findByUsername(username)
	}

	@Query(() => Number, { name: 'findFollowersCountByChannel' })
	public async findFollowersCountByChannel(
		@Args('channelId') channelId: string
	) {
		return this.channelsService.findFollowersCountByChannel(channelId)
	}
}
