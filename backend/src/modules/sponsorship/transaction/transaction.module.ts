import { Module } from '@nestjs/common'
import { Args, Mutation, Query } from '@nestjs/graphql'
import { User } from '@prisma/client'

import { MakePaymentModel } from '@/src/modules/sponsorship/transaction/models/make-payment.model'
import { TransactionModel } from '@/src/modules/sponsorship/transaction/models/transaction.model'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { TransactionResolver } from './transaction.resolver'
import { TransactionService } from './transaction.service'

@Module({
	providers: [TransactionResolver, TransactionService]
})
export class TransactionModule {
	constructor(private readonly transactionService: TransactionService) {}
	@Authorization()
	@Query(() => [TransactionModel], { name: 'findMyTransactions' })
	public async findMyTransactions(@Authorized() user: User) {
		return this.transactionService.findMyTransactions(user)
	}

	@Authorization()
	@Mutation(() => MakePaymentModel, { name: 'makePayment' })
	public async makePayment(
		@Authorized() user: User,
		@Args('planId') planId: string
	) {
		return this.transactionService.makePayment(user, planId)
	}
}
