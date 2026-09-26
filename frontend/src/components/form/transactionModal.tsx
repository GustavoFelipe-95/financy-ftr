import { useEffect, useRef, useState } from 'react';
import { transactionSchema } from '../../validations/transactionValidation';
import { Modal } from '../ui/modal';
import { IconButton } from '../ui/icon-button';
import { CalendarDays, Minus, Plus, X } from 'lucide-react';
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

export function TransactionFormModal({
    visible,
    onVisibleChange,
    mode = 'create',
    transaction,
    onSubmit,
    loading = false,
    categories
}: FormTransactionModalProps) {
    const [amountInsert, setAmountInsert] = useState('');
    const dateInputRef = useRef<HTMLInputElement>(null);

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

    const dateField = form.register('date');

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
            const transactionCategoryId = transaction.category?.id ?? transaction.categoryId;
            const selectedCategory = categories.find(
                category => String(category.id) === String(transactionCategoryId)
            )?.id;

            form.setValue('type', transaction.type);
            form.setValue('description', transaction.description);
            form.setValue('amount', transaction.amount);
            form.setValue('categoryId', selectedCategory ?? '');
            form.setValue('date', dateFormatted);

            // form.reset({
            //     type: transaction.type,
            //     description: transaction.description,
            //     amount: transaction.amount,
            //     categoryId: selectedCategory?.id ?? '',
            //     date: dateFormatted,
            // });

            setAmountInsert(
                transaction.amount === 0
                    ? ''
                    : `R$ ${formatCurrency(transaction.amount)}`
            );
        } else {
            setAmountInsert('');
        }
        
    }, [visible, mode, transaction?.id, transaction?.categoryId, transaction?.category?.id, categories, form]);

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
                        <div className='flex gap-2 border border-gray-300 p-2 rounded-md'>
                            {(['EXPENSE', 'INCOME'] as const).map((type) => {
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
                                                    : 'border-input bg-background text-muted-foreground hover:border-red-500'
                                                : isSelected
                                                    ? 'border-green-400 bg-green-100 text-green-800 ring-2 ring-green-400'
                                                    : 'border-input bg-background text-muted-foreground hover:border-green-400'
                                        )}>
                                        <span
                                            className={clsxInputs(
                                                'flex h-6 w-6 rounded-full justify-center items-center',
                                                isExpense
                                                    ? isSelected
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-gray-300 text-white'
                                                    : isSelected
                                                        ? 'bg-green-500 text-white'
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
                            <div className="relative">
                                <input
                                    type="date"
                                    {...dateField}
                                    ref={(element) => {
                                        dateField.ref(element);
                                        dateInputRef.current = element;
                                    }}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring [&::-webkit-calendar-picker-indicator]:opacity-0"
                                />
                                <button
                                    type="button"
                                    aria-label="Abrir calendário"
                                    title="Abrir calendário"
                                    onClick={() => {
                                        const input = dateInputRef.current;
                                        if (!input) return;
                                        if (typeof input.showPicker === 'function') input.showPicker();
                                        else input.click();
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </div>
                            {form.formState.errors.date && (
                                <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
                            )}
                        </div>

                        

                        <Controller
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <div className="space-y-1.5">
                                    <label htmlFor="transaction-amount" className="text-sm font-medium leading-none text-muted-foreground">
                                        Valor
                                    </label>
                                    <input
                                        id="transaction-amount"
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="Ex. 0,00"
                                        aria-invalid={!!form.formState.errors.amount}
                                        className={clsxInputs('flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring')}
                                        value={amountInsert}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/[^0-9.,]/g, '');
                                            setAmountInsert(raw);
                                            field.onChange(formatParseCurrency(raw));
                                        }}
                                        onBlur={() => {
                                            setAmountInsert(
                                                field.value === 0
                                                    ? ''
                                                    : `R$ ${formatCurrency(field.value)}`
                                            );
                                            field.onBlur();
                                        }}
                                    />
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
                            className="w-full py-6 rounded-lg bg-primary text-primary-foreground hover:bg-brand-dark"
                            type="submit"
                            disabled={loading}
                            size={'lg'}>
                            <p className="text-lg font-semibold">
                            {loading ? 'Salvando...' : 'Salvar'}
                            </p>
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}