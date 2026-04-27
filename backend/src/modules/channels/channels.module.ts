import { Module } from '@nestjs/common'

import { ChannelsResolver } from './channels.resolver'
import { ChannelsService } from './channels.service'

@Module({
	providers: [ChannelsResolver, ChannelsService]
})
export class ChannelsModule {}
