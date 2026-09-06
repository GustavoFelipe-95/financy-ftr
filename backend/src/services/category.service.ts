import { PrismaClient } from "@prisma/client";
import { CategoryCreateInput, CategoryUpdateInput } from "../dto/category.dto";
import { ERROR_MESSAGE, NOT_FOUND_ERROR } from '../errors';

export class CategoryService {
    constructor(private readonly prisma: PrismaClient) { }

    async create(userId: string, payload: CategoryCreateInput) {
        return this.prisma.category.create({
            data: {
                ...payload,
                userId
            }
        });
    }

    async update(id: string, userId: string, payload: CategoryUpdateInput) {
        return this.prisma.category.findFirst({
            where: { id, userId }
        }).then(category => {
            if (!category) {
                throw NOT_FOUND_ERROR;
            }

            return this.prisma.category.update({
                where: { id },
                data: { ...payload }
            });
        });
    }

    async delete(id: string, userId: string) {
        const searchCategory = await this.prisma.category.findFirst({
            where: { id, userId }
        });
        
        if (!searchCategory) {
            throw NOT_FOUND_ERROR;
        }
        
        const transactionsCount = await this.prisma.transaction.count({
            where: { categoryId: id, userId }
        });
        
        if (transactionsCount > 0) {
            throw ERROR_MESSAGE(
                'Cannot delete category with existing transactions.',
                'CATEGORY_DELETE_ERROR',
                400
            )
        }

        const { count } = await this.prisma.category.deleteMany({
            where: { id, userId }
        });

        return count > 0;

    }

    async findMany(userId: string) {
        return this.prisma.category.findMany({
            where: { userId }
        });
    }

    async findById(id: string) {
        return this.prisma.category.findUnique({
            where: { id }
        });
    }

    async findManyByUserId(userId: string) {
        return this.prisma.category.findMany({
            where: { userId }
        });
    }
}   