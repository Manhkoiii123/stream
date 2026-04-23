import { Field, InputType } from '@nestjs/graphql'
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength
} from 'class-validator'

@InputType()
export class CreateUserInput {
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
	@IsEmail({}, { message: 'Invalid email address' })
	public email: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	public password: string
}
