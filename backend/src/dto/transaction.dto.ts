import { InputType, Field } from "type-graphql";
import { TransactionType } from "../models/transaction.model";

@InputType()
export class TransactionCreateInput {
   
    @Field()
    description!: string;

   @Field(() => Number)
   amount!: number;
   
   @Field()
   date!: string;
   
   @Field(() => TransactionType)
   type!: TransactionType;
   
   @Field()
   categoryId!: string;
}

@InputType()
export class TransactionUpdateInput {
    @Field({ nullable: true })
    description?: string;

    @Field(() => Number, { nullable: true })
    amount?: number;

    @Field({ nullable: true })
    date?: string;

    @Field(() => TransactionType, { nullable: true })
    type?: TransactionType;

    @Field({ nullable: true })
    categoryId?: string;

}
