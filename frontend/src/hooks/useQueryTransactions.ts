import { useQuery } from '@apollo/client/react';
import { GET_TRANSACTIONS } from '@/graphql/api';

export function useQueryTransactions() {
    const { data, error, loading, refetch } = useQuery(GET_TRANSACTIONS);
    const transactions = data?.transactions ?? [];
    return { error, loading, refetch, transactions };
}