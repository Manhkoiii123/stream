import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from '@prisma/client'
import * as Upload from 'graphql-upload/Upload.js'

import { ChangeStreamInfoInput } from '@/src/modules/stream/inputs/change-stream-info.input'
import { FiltersInput } from '@/src/modules/stream/inputs/filter.input'
import { GenerateStreamTokenInput } from '@/src/modules/stream/inputs/generate-stream-token.input'
import { GenerateStreamTokenModel } from '@/src/modules/stream/models/generate-stream-token.model'
import { StreamModel } from '@/src/modules/stream/models/stream.model'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe'

import { StreamService } from './stream.service'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const GraphQLUpload = require('graphql-upload/GraphQLUpload.js')

@Resolver('Stream')
export class StreamResolver {
	constructor(private readonly streamService: StreamService) {}

	@Query(() => [StreamModel], { name: 'findStreams' })
	public async findAll(@Args('filters') input: FiltersInput) {
		return this.streamService.findAll(input)
	}

	@Query(() => [StreamModel], { name: 'findRandomStreams' })
	public async findRandom() {
		return this.streamService.findRandom()
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamInfo' })
	public async changeInfo(
		@Authorized() user: User,
		@Args('data') input: ChangeStreamInfoInput
	) {
		return this.streamService.changeInfo(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamThumbnail' })
	public async changeThumbnail(
		@Authorized() user: User,
		@Args('thumbnail', { type: () => GraphQLUpload }, FileValidationPipe)
		thumbnail: Upload
	) {
		return this.streamService.changeThumbnail(user, thumbnail)
	}
	@Authorization()
	@Mutation(() => Boolean, { name: 'removeStreamThumbnail' })
	public async removeThumbnail(@Authorized() user: User) {
		return this.streamService.removeThumbnail(user)
	}

	@Mutation(() => GenerateStreamTokenModel, { name: 'generateStreamToken' })
	public async generateStreamToken(
		@Args('data') input: GenerateStreamTokenInput
	) {
		return this.streamService.generateStreamToken(input)
	}
}
