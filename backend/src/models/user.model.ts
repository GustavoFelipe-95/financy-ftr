import { Field, ObjectType } from "type-graphql";
import { Category } from "./category.model";
import { Transaction } from "./transaction.model";

@ObjectType()
export class User {
    @Field(() => String)
    id!: string;

    @Field()
    name!: string;

    @Field()
    email!: string;

    @Field(() => [Category], { nullable: true })
    categories?: Category[];

    @Field(() => [Transaction], { nullable: true })
    transactions?: Transaction[];
}