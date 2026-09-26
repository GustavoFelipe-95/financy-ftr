import { InputType, Field } from "type-graphql";

@InputType()
export class CategoryCreateInput {
    @Field()
    title!: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    icon!: string;

    @Field()
    color!: string;
}

@InputType()
export class CategoryUpdateInput {
    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    icon?: string;

    @Field({ nullable: true })
    color?: string;
}