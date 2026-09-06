
import { Resolver, Query, Mutation, FieldResolver, Root, Ctx, Arg } from "type-graphql";
import { Transaction } from "../models/transaction.model";
import { Category } from "../models/category.model";
import { Context } from "../context";
import { NOT_AUTHENTICATED_ERROR } from "../errors";
import { TransactionCreateInput, TransactionUpdateInput } from "../dto/transaction.dto";

@Resolver(() => Transaction)
export class TransactionResolver {
    @Query(() => [Transaction])
    async transactions(
        @Ctx() context: Context,
    ) {
        if(!context.user) { throw NOT_AUTHENTICATED_ERROR; }
        return context.transactionService.findMany(context.user.id);
    }

    @Mutation(() => Transaction)
    async createTransaction(
        @Arg("data") data: TransactionCreateInput,
        @Ctx() context: Context,
    ) {
        if(!context.user) { throw NOT_AUTHENTICATED_ERROR; }
        return context.transactionService.create(context.user.id, data);
    }

    @Mutation(() => Transaction)
    async updateTransaction(
        @Arg("id") id: string,
        @Arg("data") data: TransactionUpdateInput,
        @Ctx() context: Context,
    ) {
        if(!context.user) { throw NOT_AUTHENTICATED_ERROR; }
        return context.transactionService.update(id, context.user.id, data);
    }

    @Mutation(() => Boolean)
    async deleteTransaction(
        @Arg("id") id: string,
        @Ctx() context: Context,
    ) {
        if(!context.user) { throw NOT_AUTHENTICATED_ERROR; }
        return context.transactionService.delete(id, context.user.id);
    }

    @FieldResolver(() => String)
    date(@Root() parent: { date: string }) {
        if(typeof parent.date !== "string") {
            return (parent.date as Date).toISOString();
        }
        return parent.date;
    }

    @FieldResolver(() => Category, { nullable: true })
    async category(
        @Root() parent: { categoryId: string },
        @Ctx() context: Context,
    ) {        
        return context.transactionService.findCategoryById(parent.categoryId);
    }
}