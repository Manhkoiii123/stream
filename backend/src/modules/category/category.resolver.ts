import { Args, Query, Resolver } from '@nestjs/graphql'

import { CategoryModel } from '@/src/modules/category/models/category.model'

import { CategoryService } from './category.service'

@Resolver('category')
export class CategoryResolver {
	constructor(private readonly categoryService: CategoryService) {}

	@Query(() => [CategoryModel], { name: 'findAllCategories' })
	public async findAll() {
		return this.categoryService.findAll()
	}
	@Query(() => [CategoryModel], { name: 'findRandomCategories' })
	public async findRandom() {
		return this.categoryService.findRandom()
	}

	@Query(() => CategoryModel, { name: 'findCategoryById' })
	public async findById(@Args('slug') slug: string) {
		return this.categoryService.findBySlug(slug)
	}
}
