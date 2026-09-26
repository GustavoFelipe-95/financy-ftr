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

export interface CreateTransactionInput {
    type: TransactionType;
    amount: number;
    description: string;
    date: string;
    categoryId: string;
}

export interface UpdateTransactionInput {
    type?: TransactionType;
    amount?: number;
    description?: string;
    date?: string;
    categoryId?: string;
}

export const TRANSACTION_TYPES_TABLE_LABEL: Record<TransactionType, string> = {
    INCOME: 'Entrada',
    EXPENSE: 'Saída',
};

export const TRANSACTION_TYPES_LABEL: Record<TransactionType, string> = {
    INCOME: 'Receita',
    EXPENSE: 'Despesa',
};

export const TRANSACTION_FILTER_DEFAULT = 'all'

export const TRANSACTION_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: TRANSACTION_FILTER_DEFAULT, label: 'Todos' },
  { value: 'INCOME', label: 'Entrada' },
  { value: 'EXPENSE', label: 'Saída' },
]