import { TokenType, User } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

import { PrismaService } from '@/src/core/prisma/prisma.service'

export async function generateToken(
	prismaService: PrismaService,
	user: User,
	type: TokenType,
	isUUID: boolean = true
) {
	let token: string

	if (isUUID) {
		token = uuidv4()
	} else {
		token = Math.floor(
			Math.random() * (1000000 - 100000) + 100000
		).toString()
	}
	const expiresAt = new Date(new Date().getTime() + 300000)
	const existingToken = await prismaService.token.findFirst({
		where: {
			user: {
				id: user.id
			},
			type
		}
	})
	if (existingToken) {
		await prismaService.token.delete({
			where: {
				id: existingToken.id
			}
		})
	}

	const newToken = await prismaService.token.create({
		data: {
			token,
			type,
			expiresIn: expiresAt,
			user: {
				connect: { id: user.id }
			}
		},
		include: {
			user: true
		}
	})
	return newToken
}
