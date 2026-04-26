/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'

import { NewPasswordInput } from '@/src/modules/auth/password-recovery/inputs/new-password.input'

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface {
	public validate(passwordRepeat: string, agrs: ValidationArguments) {
		const object = agrs.object as NewPasswordInput
		return object.password === passwordRepeat
	}
	public defaultMessage(args?: ValidationArguments) {
		return 'Passwords do not match'
	}
}
