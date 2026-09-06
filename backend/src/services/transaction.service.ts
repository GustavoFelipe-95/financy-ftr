import { PrismaClient } from "@prisma/client";

export class TransactionService {
    constructor(private readonly prisma: PrismaClient) { }

    async create() {
        // Implement create logic here
    }

    async update() {
        // Implement update logic here
    }

    async delete() {
        // Implement delete logic here
    }

    async findMany() {
        // Implement findMany logic here
    }

    async findManyByCategoryId() {
        // Implement findManyByCategoryId logic here
    }

    async findCategoryById() {
        // Implement findCategoryById logic here
    }
}