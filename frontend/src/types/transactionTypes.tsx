export type TransactionType = 'INCOME' | 'EXPENSE';

export interface TransactionQueryData {
    transactions: Transaction[];
}

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    description: string;
    date: string;
    categoryId: string;
    category?: TransactionCategory | null;
}

export interface TransactionCategory {
    id: string;
    title: string;
    icon?: string | null;
    color?: string | null;
}