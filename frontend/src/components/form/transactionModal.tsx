import { useEffect, useState } from 'react';
import { transactionSchema } from '../../validations/transactionValidation';
import { Modal } from '../ui/modal';
import { IconButton } from '../ui/icon-button';
import { Minus, Plus, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { SelectField } from '../ui/select';
import { TRANSACTION_TYPES_LABEL, type CreateTransactionInput, type Transaction, type TransactionType } from '@/types';
import { clsxInputs } from '@/lib/clsxInputs';
import { formatCurrency, formatParseCurrency } from '@/lib/utils';

type FormDataValues = z.infer<typeof transactionSchema>;

export interface FormTransactionModalProps {
    visible: boolean;
    onVisibleChange: (visible: boolean) => void;
    mode: 'create' | 'edit';
    transaction?: Transaction | null;
    onSubmit: (data: CreateTransactionInput) => Promise<void>;
    loading: boolean;
    categories: { id: string; title: string }[];
}

export function FormTransactionModal({
    visible,
    onVisibleChange,
    mode = 'create',
    transaction,
    onSubmit,
    loading = false,
    categories
}: FormTransactionModalProps) {
    const [amountInsert, setAmountInsert] = useState('');

    const categoryOptions = categories.map(cat => ({ value: cat.id, label: cat.title }))

    const form = useForm<FormDataValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: 'EXPENSE',
            description: '',
            amount: 0,
            categoryId: '',
            date: '',
        }
    })

    useEffect(() => {
        if(!visible) {
            form.reset({
                type: 'EXPENSE',
                description: '',
                amount: 0,
                categoryId: '',
                date: '',
            });
            return;
        }

        if(mode === 'edit' && transaction) {
            const dateFormatted =
                transaction.date
                    ? new Date(transaction.date).toISOString().split('T')[0]
                    : '';

            form.reset({
                type: transaction.type,
                description: transaction.description,
                amount: transaction.amount,
                categoryId: transaction.categoryId,
                date: dateFormatted,
            });

            setAmountInsert(
                transaction.amount === 0
                    ? ''
                    : `R$ ${formatCurrency(transaction.amount)}`
            );
        } else {
            setAmountInsert('');
        }
        
    }, [visible, mode, transaction?.id, form]);

    async function handleSubmit(data: FormDataValues) {
        const sendData: CreateTransactionInput = {
            description: data.description,
            amount: data.amount,
            categoryId: data.categoryId,
            date: data.date,
            type: data.type as TransactionType
        };
        await onSubmit(sendData);
        onVisibleChange(false);
    }

    return (
        <Modal
            open={visible}
            onOpenChange={onVisibleChange}
            contentClassName='p-0'>
            <div className='p-6'>
                <div className='flex items-start justify-between gap-4'>
                    <div className='min-w-0 space-y-1'>
                        <h2 className='text-lg font-semibold'>
                            {mode === 'create' ? 'Nova Transação' : 'Editar Transação'}
                        </h2>
                        <p className='text-sm text-muted-foreground'>
                            {mode === 'create' ? 'Registre sua despesa ou receita.' : 'Altere os dados da transação.'}
                        </p>
                    </div>
                    <IconButton
                        size="sm"
                        onClick={() => onVisibleChange(false)}
                        aria-label="Fechar"
                        className="rounded-md shrink-0">
                        <X className="w-4 h-4" />
                    </IconButton>
                </div>

                <form
                    className="flex flex-col mt-6 gap-4"
                    onSubmit={form.handleSubmit(handleSubmit)}>

                    <div className='space-y-2'>
                        <label
                            className='text-sm font-medium leading-none text-muted-foreground'>
                            Tipo
                        </label>
                        <div className='flex gap-2'>
                            {(['INCOME', 'EXPENSE'] as const).map((type) => {
                                const isSelected = form.watch('type') === type;
                                const isExpense = type === 'EXPENSE';
                                const IconVariable = isExpense ? Minus : Plus;

                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => form.setValue('type', type)}
                                        aria-pressed={isSelected}
                                        className={clsxInputs(
                                            'flex flex-1 justify-center items-center gap-2 py-2.5 rounded-md border transition-colors text-sm font-medium',
                                            isExpense
                                                ? isSelected
                                                    ? 'border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500'
                                                    : 'border-input bg-background text-muted-foreground hover:border-gray-400'
                                                : isSelected
                                                    ? 'border-gray-400 bg-gray-100 text-gray-800 ring-2 ring-gray-400'
                                                    : 'border-input bg-background text-muted-foreground hover:border-gray-400'
                                        )}>
                                        <span
                                            className={clsxInputs(
                                                'flex h-6 w-6 rounded-full justify-center items-center',
                                                isExpense
                                                    ? isSelected
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-gray-300 text-white'
                                                    : isSelected
                                                        ? 'bg-gray-500 text-white'
                                                        : 'bg-gray-300 text-white'
                                            )}>
                                            <IconVariable className="w-4 h-4" aria-hidden />
                                        </span>
                                        {TRANSACTION_TYPES_LABEL[type]}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <Input
                        label="Descrição"
                        {...form.register('description')}
                        placeholder="Ex. Almoço no restaurante"
                        error={!!form.formState.errors.description?.message} />
                    {form.formState.errors.description && (
                        <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                    )}

                    <div className='grid grid-cols-2 gap-4'>
                        <div className="space-y-1.5">
                            <label
                                className='text-sm font-medium leading-none text-muted-foreground'>
                                Data
                            </label>
                            <input
                                type="date"
                                {...form.register('date')}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            {form.formState.errors.date && (
                                <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
                            )}
                        </div>

                        <Controller
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <div>
                                    <label className='text-sm font-medium leading-none text-muted-foregound'>
                                        Valor
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="Ex. 0,00"
                                        className={clsxInputs('flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring')}
                                        value={amountInsert}
                                        onChange={(e) => {
                                            setAmountInsert(e.target.value);
                                            field.onChange(formatParseCurrency(e.target.value))
                                        }}
                                        onBlur={() => {
                                            setAmountInsert(
                                                field.value === 0
                                                    ? ''
                                                    : `R$ ${formatCurrency(field.value)}`
                                            );
                                            field.onBlur();
                                        }} />
                                    {form.formState.errors.amount && (
                                        <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
                                    )}
                                </div>
                            )}
                        />
                    </div>

                    <Controller
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <SelectField
                                label="Categoria"
                                placeholder="Selecione"
                                value={field.value}
                                onValueChange={field.onChange}
                                options={categoryOptions}
                                error={!!form.formState.errors.categoryId?.message} />
                        )}
                    />
                    {form.formState.errors.categoryId && (
                        <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>
                    )}

                    <div className="pt-2 justify-center flex">
                        <Button
                            className="w-full rounded-lg bg-primary text-primary-foreground hover:bg-brand-dark"
                            type="submit"
                            disabled={loading}
                            size={'lg'}>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}