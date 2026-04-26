import { Field, InputType } from '@nestjs/graphql'
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	MinLength
} from 'class-validator'

@InputType()
export class DeactivateInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	public email: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	public password: string

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	@Length(6, 6, { message: 'TOTP code must be exactly 6 digits' })
	public pin?: string
}
