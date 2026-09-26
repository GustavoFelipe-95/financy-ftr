import { PrismaClient } from "@prisma/client";
import { TransactionCreateInput, TransactionUpdateInput } from "../dto/transaction.dto";
import { ERROR_MESSAGE } from "../errors";

export class TransactionService {
    constructor(private readonly prisma: PrismaClient) { }

    async create(userId: string, payload: TransactionCreateInput) {
        const category = await this.prisma.category.findFirst({
            where: { id: payload.categoryId, userId }
        });

        if (!category) {
            throw ERROR_MESSAGE(
                'Category not found',
                'CATEGORY_NOT_FOUND',
                404
            )
        }

        return this.prisma.transaction.create({
            data: {
                userId: userId,
                description: payload.description,
                amount: payload.amount,
                date: new Date(payload.date),
                type: payload.type,
                categoryId: payload.categoryId
            }
        });
    }

    async update(id: string, userId: string, payload: TransactionUpdateInput) {
        const transaction = await this.prisma.transaction.findFirst({
            where: { id, userId }
        });

        if (!transaction) {
            throw ERROR_MESSAGE(
                'Transaction not found',
                'TRANSACTION_NOT_FOUND',
                404
            )
        }

        const sendData: {
            description?: string,
            amount?: number,
            date?: Date,
            type?: 'INCOME' | 'EXPENSE',
            categoryId?: string
        } = {}

        if (payload.description !== undefined) sendData.description = payload.description;
        if (payload.amount !== undefined) sendData.amount = payload.amount;
        if (payload.date !== undefined) sendData.date = new Date(payload.date);
        if (payload.type !== undefined) sendData.type = payload.type;
        if (payload.categoryId !== undefined) {
            const category = await this.prisma.category.findFirst({
                where: { id: payload.categoryId, userId }
            });

            if (!category) {
                throw ERROR_MESSAGE(
                    'Category not found',
                    'CATEGORY_NOT_FOUND',
                    404
                )
            }

            sendData.categoryId = payload.categoryId;
        }

        return this.prisma.transaction.update({
            where: { id },
            data: sendData
        });
    }

    async delete(id: string, userId: string): Promise<boolean> {
        const { count } = await this.prisma.transaction.deleteMany({
            where: { id, userId }
        });
        return count > 0;
    }

    async findMany(userId: string) {
        return this.prisma.transaction.findMany({
            where: { userId }
        });
    }

    async findManyByCategoryId(categoryId: string) {
        return this.prisma.transaction.findMany({
            where: { categoryId }
        });
    }

    async findCategoryById(categoryId: string) {
        return this.prisma.category.findUnique({
            where: { id: categoryId }
        });
    }
}