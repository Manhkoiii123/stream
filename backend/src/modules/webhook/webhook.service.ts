/* eslint-disable @typescript-eslint/await-thenable */
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TransactionStatus } from '@prisma/client'
import Stripe from 'stripe'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { LivekitService } from '@/src/modules/libs/livekit/livekit.service'
import { StripeService } from '@/src/modules/libs/stripe/stripe.service'
import { NotificationService } from '@/src/modules/notification/notification.service'

@Injectable()
export class WebhookService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly livekitService: LivekitService,
		private readonly notificationService: NotificationService,
		private readonly configService: ConfigService,
		private readonly stripeService: StripeService
	) {}

	public async receiveWebhookLivekit(body: string, authorization: string) {
		const event = await this.livekitService.receiver.receive(
			body,
			authorization,
			true
		)
		if (event.event === 'ingress_started') {
			const stream = await this.prismaService.stream.update({
				where: {
					ingressId: event.ingressInfo?.ingressId
				},
				data: {
					isLive: true
				},
				include: {
					user: true
				}
			})
			if (!stream.user) {
				throw new Error('User not found')
			}
			const followers = await this.prismaService.follow.findMany({
				where: {
					followingId: stream.user.id,
					follower: {
						isDeactivated: false
					}
				},
				include: {
					follower: {
						include: {
							notificationSettings: true
						}
					}
				}
			})
			for (const follow of followers) {
				const follower = follow.follower
				if (follower.notificationSettings?.siteNotifications) {
					await this.notificationService.createStreamStart(
						follower.id,
						stream.user
					)
				}
			}
		}
		if (event.event === 'ingress_ended') {
			const stream = await this.prismaService.stream.update({
				where: {
					ingressId: event.ingressInfo?.ingressId
				},
				data: {
					isLive: false
				}
			})
			await this.prismaService.chatMessage.deleteMany({
				where: {
					streamId: stream.id
				}
			})
		}
	}

	public async receiveWebhookStripe(event: Stripe.Event) {
		const sessions = event.data.object as Stripe.Checkout.Session
		if (event.type === 'checkout.session.completed') {
			const planId = sessions.metadata?.planId
			const userId = sessions.metadata?.userId
			const channelId = sessions.metadata?.channelId
			const expiresAt = new Date()
			expiresAt.setDate(expiresAt.getDay() + 30)

			const sponsorshipSubscription =
				await this.prismaService.sponsorshipSubscription.create({
					data: {
						userId,
						channelId,
						planId,
						expiresAt
					},
					include: {
						plan: true,
						user: true,
						channel: {
							include: {
								notificationSettings: true
							}
						}
					}
				})
			await this.prismaService.transaction.updateMany({
				where: {
					stripeSubscriptionId: sessions.id,
					status: TransactionStatus.PENDING
				},
				data: {
					status: TransactionStatus.SUCCESS
				}
			})
			if (
				sponsorshipSubscription.channel?.notificationSettings
					?.siteNotifications &&
				sponsorshipSubscription.plan &&
				sponsorshipSubscription.user
			) {
				await this.notificationService.createNewSponsorship(
					sponsorshipSubscription.channel.id,
					sponsorshipSubscription.plan,
					sponsorshipSubscription.user
				)
			}
			return sponsorshipSubscription
		}
		if (event.type === 'checkout.session.expired') {
			await this.prismaService.transaction.updateMany({
				where: {
					stripeSubscriptionId: sessions.id
				},
				data: {
					status: TransactionStatus.EXPIRED
				}
			})
		}
		if (event.type === 'checkout.session.async_payment_failed') {
			await this.prismaService.transaction.updateMany({
				where: {
					stripeSubscriptionId: sessions.id
				},
				data: {
					status: TransactionStatus.FAILED
				}
			})
		}
	}
	public contructStripeEvent(payload: any, signature: any) {
		return this.stripeService.webhooks.constructEvent(
			payload,
			signature,
			this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET')
		)
	}
}
