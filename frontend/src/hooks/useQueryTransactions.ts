import { useQuery } from '@apollo/client/react';
import { GET_TRANSACTIONS } from '@/graphql/api';
import type { TransactionQueryData } from '@/types/transactionTypes';

export function useQueryTransactions() {
    const { data, error, loading, refetch } = useQuery<TransactionQueryData>(GET_TRANSACTIONS);
    const transactions = data?.transactions ?? [];
    return { error, loading, refetch, transactions };
}