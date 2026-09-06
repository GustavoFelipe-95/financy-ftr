
import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";
import { comparePassword, generateAuthToken, hashPassword } from "../utils/authenticate";

export const ErroUserExists = new GraphQLError('User already exists', { extensions: { code: 'USER_EXISTS', http: {status: 400} } });
export const ErroInvalidCredentials = new GraphQLError('Invalid credentials', { extensions: { code: 'INVALID_CREDENTIALS', http: {status: 400} } });

export class AuthService {
    constructor(private readonly prisma: PrismaClient) { }

    async signup(name: string, email: string, password: string) {
        let searchUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (searchUser) {
            throw ErroUserExists;
        }

        const hashedPassword = await hashPassword(password);

        const createdUser = await this.prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        const generateToken = generateAuthToken(createdUser.id);
        return { token: generateToken, user: createdUser };
    }

    async login(email: string, password: string) {
        const searchUser = await this.prisma.user.findUnique({
            where: { email },
        });
        
        if (!searchUser) {
            throw ErroInvalidCredentials;
        }

        const isPasswordValid = await comparePassword(password, searchUser.password);
        
        if (!isPasswordValid) {
            throw ErroInvalidCredentials;
        }
        
        const generateToken = generateAuthToken(searchUser.id);

        return { user: searchUser, token: generateToken };
    }

    async getUserById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async updateUser(id: string, data: { name: string }) {
        return this.prisma.user.update({
            where: { id },
            data: { name: data.name },
        });
    }
}