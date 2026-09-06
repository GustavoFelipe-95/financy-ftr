import { Field, ObjectType } from "type-graphql";
import { Transaction } from "./transaction.model";

@ObjectType()
export class Category {
    @Field(() => String)
    id!: string;

    @Field()
    title!: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    icon!: string;

    @Field()
    color!: string;

    @Field(() => [Transaction], { nullable: true })
    transactions!: Transaction[];
}
