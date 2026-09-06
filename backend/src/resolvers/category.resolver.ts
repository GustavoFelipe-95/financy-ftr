import { Query, Resolver, Mutation, FieldResolver, Ctx, Root, Arg } from "type-graphql";
import { Category } from "../models/category.model";
import { Transaction } from "../models/transaction.model";
import { Context } from "../context";
import { CategoryCreateInput, CategoryUpdateInput } from "../dto/category.dto";
import { NOT_AUTHENTICATED_ERROR } from "../errors";

@Resolver(() => Category)
export class CategoryResolver {
    @Query(() => [Category])
    async categories(
        @Ctx() context: Context
    ) {
        if (!context.user) { throw NOT_AUTHENTICATED_ERROR }
        return context.categoryService.findMany(context.user.id);
    }

    @Mutation(() => Category)
    async createCategory(
        @Arg("data") data: CategoryCreateInput,
        @Ctx() context: Context
    ) {
        if (!context.user) { throw NOT_AUTHENTICATED_ERROR }
        return context.categoryService.create(context.user.id, data);
    }

    @Mutation(() => Category)
    async updateCategory(
        @Arg("id") id: string,
        @Arg("data") data: CategoryUpdateInput,
        @Ctx() context: Context
    ) {
        if (!context.user) { throw NOT_AUTHENTICATED_ERROR }
        return context.categoryService.update(id, context.user.id, data);        
    }

    @Mutation(() => Boolean)
    async deleteCategory(
        @Arg("id") id: string,
        @Ctx() context: Context
    ) {
        if (!context.user) { throw NOT_AUTHENTICATED_ERROR }
        return context.categoryService.delete(id, context.user.id);
    }

    @FieldResolver(() => [Transaction], { nullable: true })
    async transactions(
        @Root() parent: { id: string },
        @Ctx() context: Context
    ) {
        return context.transactionService.findManyByCategoryId(parent.id);
    }
}