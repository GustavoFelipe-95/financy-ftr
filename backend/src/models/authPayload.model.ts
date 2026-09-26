import { Field, ObjectType } from "type-graphql";
import { User } from "./user.model";

@ObjectType()
export class AuthPayload {
    @Field()
    token!: string;

    @Field(() => User)
    user!: User;
}