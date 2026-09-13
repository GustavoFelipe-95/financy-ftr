import { z } from 'zod';

export const transactionSchema = z.object({
    type: z.enum(['INCOME', 'EXPENSE']),
    description: z.string().min(1, 'A descrição é obrigatória'),
    amount: z.number().min(0, 'O valor deve ser maior ou igual a zero'),
    date: z.string().min(1, 'A data é obrigatória'),
    categoryId: z.string().min(1, 'A categoria é obrigatória')
});