import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Auth } from '../../utils/guards';
import { Role } from '../users/schemas/user-roles.enum';
import { ProductsService } from './products.service';
import {
	Product,
	CreateProductInput,
	UpdateProductInput,
} from './schemas/product.types';

@Resolver()
export class ProductsResolver {
	constructor(private productsService: ProductsService) {}
	@Query(() => [Product])
	Products() {
		return this.productsService.findAll();
	}

	@Query(() => Product, { nullable: true })
	Product(@Args('id', { type: () => Int }) id: number) {
		const product = this.productsService.findOne(id);
		if (!product) {
			throw new NotFoundException();
		}
		return product;
	}

	@Auth(Role.Admin)
	@Mutation(() => Product)
	createProduct(@Args('input') input: CreateProductInput) {
		return this.productsService.create(input);
	}

	@Auth(Role.Admin)
	@Mutation(() => Product)
	updateProduct(@Args('input') input: UpdateProductInput) {
		const product = this.productsService.update(input.id, input);
		if (!product) {
			throw new NotFoundException();
		}
		return product;
	}

	@Auth(Role.Admin)
	@Mutation(() => Product)
	removeProduct(@Args('id', { type: () => Int }) id: number) {
		const product = this.productsService.remove(id);
		if (!product) {
			throw new NotFoundException();
		}
		return product;
	}
}
