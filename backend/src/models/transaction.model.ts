import { Field, ObjectType, registerEnumType } from "type-graphql";
import { Category } from "./category.model";

export enum TransactionType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE"
}

registerEnumType(TransactionType, {
    name: "TransactionType",
    description: "The type of the transaction",
});


@ObjectType()
export class Transaction {
    @Field(() => String)
    id!: string;

    @Field()
    description!: string;

    @Field(() => Number)
    amount!: number;

    @Field()
    date!: string;

    @Field(() => TransactionType)
    type!: TransactionType;

    @Field(() => String)
    categoryId!: string;

    @Field(() => Category, { nullable: true })
    category?: Category;
}
