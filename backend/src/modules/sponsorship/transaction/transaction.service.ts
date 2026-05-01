import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { StripeService } from '@/src/modules/libs/stripe/stripe.service'

@Injectable()
export class TransactionService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly stripeService: StripeService
	) {}

	public async findMyTransactions(user: User) {
		const transactions = await this.prismaService.transaction.findMany({
			where: {
				userId: user.id
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
		return transactions
	}

	public async makePayment(user: User, planId: string) {
		const plan = await this.prismaService.sponsorshipPlan.findUnique({
			where: {
				id: planId
			},
			include: {
				channel: true
			}
		})
		if (!plan) {
			throw new NotFoundException('Plan not found')
		}
		if (user.id === plan.channelId) {
			throw new ConflictException(
				'You cannot subscribe to your own channel'
			)
		}
		const existingSubscription =
			await this.prismaService.sponsorshipSubscription.findFirst({
				where: {
					userId: user.id,
					channelId: plan.channel?.id
				}
			})

		if (existingSubscription) {
			throw new ConflictException(
				'You are already subscribed to this channel'
			)
		}
		const customer = await this.stripeService.customers.create({
			name: user.displayName,
			email: user.email
		})
		const session = await this.stripeService.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: plan.title
						},
						unit_amount: Math.round(plan.price * 100),
						recurring: {
							interval: 'month'
						}
					},
					quantity: 1
				}
			],
			mode: 'subscription',
			success_url: `${this.configService.get<string>('ALLOWED_ORIGIN')}/success?price=${encodeURIComponent(plan.title)}&username=${encodeURIComponent(plan.channel?.username || '')}`,
			cancel_url: `${this.configService.get<string>('ALLOWED_ORIGIN')}`,
			customer: customer.id,
			metadata: {
				planId: plan.id,
				userId: user.id,
				channelId: plan.channelId
			}
		})
		await this.prismaService.transaction.create({
			data: {
				amount: plan.price,
				currency: session.currency || 'usd',
				stripeSubscriptionId: session.id,
				user: {
					connect: {
						id: user.id
					}
				}
			}
		})
		return {
			url: session.url
		}
	}
}
