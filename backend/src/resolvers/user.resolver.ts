import { Arg, FieldResolver, Mutation, Resolver, Root } from "type-graphql";
import { User } from "../models/user.model";
import { Category } from "../models/category.model";
import { Transaction } from "../models/transaction.model";
import { Query, Ctx } from "type-graphql";
import { Context } from "../context";
import { ERROR_MESSAGE } from "../errors";

@Resolver(() => User)
export class UserResolver {
    @Query(() => User, { nullable: true })
    async me(
        @Ctx() context: Context,
    ) {
        if(!context.user) {
            throw ERROR_MESSAGE(
                "User is not authenticated",
                "UNAUTHORIZED",
                401,
            )
        }
        const user = await context.authService.getUserById(context.user.id);
        return user ?? null;
    }

    @Mutation(() => User)
    async updateUser(
        @Arg("name") name: string,
        @Ctx() context: Context,
    ) {
        if(!context.user) {
            throw ERROR_MESSAGE(
                "User is not authenticated",
                "UNAUTHORIZED",
                401,
            )
        }
        return await context.authService.updateUser(context.user.id, { name });
    }

    @FieldResolver(() => [Category], {nullable: true})
    async categories(
        @Root() parent: { id: string},
        @Ctx() context: Context,
    ) {
        return await context.categoryService.findManyByUserId(parent.id);
    }

    @FieldResolver(() => [Transaction], {nullable: true})
    async transactions(
        @Root() parent: { id: string},
        @Ctx() context: Context,
    ) {
        return await context.transactionService.findMany(parent.id);
    }
}