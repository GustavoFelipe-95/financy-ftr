import { useMutation } from "@apollo/client/react";
import {
    CREATE_TRANSACTION, UPDATE_TRANSACTION, DELETE_TRANSACTION,
    CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY,
    UPDATE_USER
} from "@/graphql/api";
import type { CreateTransactionInput, UpdateTransactionInput } from "@/types/transactionTypes";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/types/categoryTypes";
import type { UpdateProfileInput, UserType } from "@/types/authTypes";

function handleCategoryError(error: any): { message: string; statusCode?: string } | null {
    if (!error) return null;
    const message = error.message ?? null;
    if(message && message.includes('it has') && message.includes('transaction(s)')) {
        const isMatch = message.match(/it has (\d+) transaction/);
        const transactionCount = isMatch ? parseInt(isMatch[1]) : 0;

        return {
            message: `Não é possivel excluir a categoria, pois ela possui ${transactionCount} ${transactionCount > 1 ? 'transações' : 'transação'}.`,
            statusCode: 'CATEGORY_HAS_TRANSACTIONS'
        };
    } else {
        return { message: "An unknown error occurred." };
    }
}

export function useTransactionMutations(onRefresh?: () => void) {
    const [createMut, { loading: createLoading, error: createError }] =
        useMutation(CREATE_TRANSACTION, { onCompleted: () => onRefresh?.() });
    
    const [updateMut, { loading: updateLoading, error: updateError }] =
        useMutation(UPDATE_TRANSACTION, { onCompleted: () => onRefresh?.() });

    const [deleteMut, { loading: deleteLoading, error: deleteError }] =
        useMutation(DELETE_TRANSACTION, { onCompleted: () => onRefresh?.() });

    const createTransactionMut = async (data: CreateTransactionInput) => {
        await createMut({ variables: { data } })
    }

    const updateTransactionMut = async (id: string, data: UpdateTransactionInput) => {
        await updateMut({ variables: { id, data } })
    }

    const deleteTransactionMut = async (id: string) => {
        await deleteMut({ variables: { id } })
    }

    return {
        createTransaction: createTransactionMut,
        updateTransaction: updateTransactionMut,
        deleteTransaction: deleteTransactionMut,
        loadingTransaction: createLoading || updateLoading || deleteLoading,
        errorTransaction: createError || updateError || deleteError
    };
}

export function useCategoriesMutations(onRefresh?: () => void) {
    const [createMut, { loading: createLoading, error: createError }] =
        useMutation(CREATE_CATEGORY, { onCompleted: () => onRefresh?.() });

    const [updateMut, { loading: updateLoading, error: updateError }] =
        useMutation(UPDATE_CATEGORY, { onCompleted: () => onRefresh?.() });

    const [deleteMut, { loading: deleteLoading, error: deleteError }] =
        useMutation(DELETE_CATEGORY, { onCompleted: () => onRefresh?.() });

    const errorDetected = createError ?? updateError ?? deleteError;
    const capturedError = errorDetected ? handleCategoryError(errorDetected) : null;

    const createCategoryMut = async (data: CreateCategoryInput) => {
        await createMut({ variables: { data } })
    }
    
    const updateCategoryMut = async (id: string, data: UpdateCategoryInput) => {
        await updateMut({ variables: { id, data } })
    }

    const deleteCategoryMut = async (id: string) => {
        await deleteMut({ variables: { id } })
    }
    
    return {
        create: createCategoryMut,
        update: updateCategoryMut,
        delete: deleteCategoryMut,
        loading: createLoading || updateLoading || deleteLoading,
        error: capturedError,
        statusCodeError: capturedError?.statusCode ?? null
    };
}

export function useProfileMutations(
    onCompleted?: (user: any) => void,
) {
    const [updateMut, { loading: updateLoading, error: updateError }] =
        useMutation(UPDATE_USER, {
            onCompleted: (data: any) => onCompleted?.(data.updateUser),
        });

    const updateProfileMut = async (
        id: string,
        data: UpdateProfileInput,
    ) => {
        return await updateMut({ variables: { id, data } });
    };

    return {
        updateProfile: updateProfileMut,
        loadingProfile: updateLoading,
        errorProfile: updateError,
    };
}