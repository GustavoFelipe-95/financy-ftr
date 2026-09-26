import { useQuery } from '@apollo/client/react';
import { GET_CATEGORIES } from '@/graphql/api';
import type { CategoryQueryData } from '@/types/categoryTypes';

export function useQueryCategories() {
    const { data, error, loading, refetch } = useQuery<CategoryQueryData>(GET_CATEGORIES);

    const categories = data?.categories ?? [];

    const countCategories = categories.length;

    const countTransactions = categories.reduce(
        (acc, category) =>
            acc + (category.transactions?.length ?? 0),
        0
    );

    const mostUsedCategory = categories.length > 0
        ? [...categories].sort((a, b) => (b.transactions?.length ?? 0) - (a.transactions?.length ?? 0))[0]
        : null;

    return { error, loading, refetch, categories, countCategories, countTransactions, mostUsedCategory };
}