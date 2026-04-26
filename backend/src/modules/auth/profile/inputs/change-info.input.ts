import { Field, InputType } from '@nestjs/graphql'
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength
} from 'class-validator'

@InputType()
export class ChangeInfoInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9_]+$/, {
		message: 'Username can only contain letters, numbers, and underscores'
	})
	public username: string

	@Field()
	@IsString()
	@IsNotEmpty()
	public displayName: string

	@Field()
	@IsString()
	@IsOptional()
	@MaxLength(300, {
		message: 'Bio must be at most 300 characters long'
	})
	public bio?: string
}
