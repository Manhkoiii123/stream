import { Field, ObjectType } from '@nestjs/graphql'
import { Follow } from '@prisma/client'

import { UserModel } from '@/src/modules/auth/account/models/user.model'

@ObjectType()
export class FollowModel implements Follow {
	@Field(() => String)
	id: string

	@Field(() => String)
	followerId: string

	@Field(() => UserModel)
	follower: UserModel

	@Field(() => UserModel)
	following: UserModel

	@Field(() => String)
	followingId: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
