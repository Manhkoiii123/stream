import { Field, ObjectType } from '@nestjs/graphql'
import { Category } from '@prisma/client'

import { StreamModel } from '@/src/modules/stream/models/stream.model'

@ObjectType()
export class CategoryModel implements Category {
	@Field(() => String)
	id: string

	@Field(() => String)
	title: string

	@Field(() => String)
	slug: string

	@Field(() => String, { nullable: true })
	description: string

	@Field(() => String)
	thumbnailUrl: string

	@Field(() => [StreamModel])
	streams: StreamModel[]

	@Field(() => Date)
	createdAt: Date
	@Field(() => Date)
	updatedAt: Date
}
