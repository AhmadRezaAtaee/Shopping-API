import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Auth } from '../../utils/guards';
import { Role } from '../users/schemas/user-roles.enum';
import { ProductCategoriesService } from './product-categories.service';
import {
	CreateProductCategoryInput,
	ProductCategory,
	UpdateProductCategoryInput,
} from './schemas/product-category.types';

@Resolver()
export class ProductCategoriesResolver {
	constructor(private productCategoriesService: ProductCategoriesService) {}

	@Query(() => [ProductCategory])
	ProductCategories() {
		return this.productCategoriesService.findAll();
	}

	@Query(() => ProductCategory, { nullable: true })
	ProductCategory(@Args('id', { type: () => Int }) id: number) {
		const productCategory = this.productCategoriesService.findOne(id);
		if (!productCategory) {
			throw new NotFoundException();
		}
		return productCategory;
	}

	@Auth(Role.Admin)
	@Mutation(() => ProductCategory)
	createProductCategory(@Args('input') input: CreateProductCategoryInput) {
		return this.productCategoriesService.create(input);
	}

	@Auth(Role.Admin)
	@Mutation(() => ProductCategory)
	updateProductCategory(@Args('input') input: UpdateProductCategoryInput) {
		const productCategory = this.productCategoriesService.update(
			input.id,
			input,
		);
		if (!productCategory) {
			throw new NotFoundException();
		}
		return productCategory;
	}

	@Auth(Role.Admin)
	@Mutation(() => ProductCategory)
	removeProductCategory(@Args('id', { type: () => Int }) id: number) {
		const productCategory = this.productCategoriesService.remove(id);
		if (!productCategory) {
			throw new NotFoundException();
		}
		return productCategory;
	}
}
