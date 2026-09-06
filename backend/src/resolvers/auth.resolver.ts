import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { AuthPayload } from "../models/authPayload.model";
import { User } from "../models/user.model";
import { Context } from "../context";

@Resolver()
export class AuthResolver {
    @Mutation(() => AuthPayload)
    async signup(
        @Arg("name") name: string,
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() context: Context
    ): Promise<AuthPayload> {
        const {token, user} = await context.authService.signup(name, email, password);
        return {
            token,
            user: user as unknown as User,
        };
    }

    @Mutation(() => AuthPayload)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() context: Context
    ): Promise<AuthPayload> {
        const {token, user} = await context.authService.login(email, password);
        return {
            token,
            user: user as unknown as User,
        };
    }
}