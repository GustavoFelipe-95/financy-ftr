import { useQueryTransactions } from '@/hooks/useQueryTransactions';
import { useTransactionMutations } from '@/hooks/useMutations';
import type { CreateTransactionInput, Transaction, TransactionType } from '@/types/transactionTypes';
import type { Category } from '@/types/categoryTypes';
import { useQueryCategories } from '@/hooks/useQueryCategories';
import { useState, useMemo } from 'react';
import { TRANSACTION_FILTER_DEFAULT, TRANSACTION_TYPE_OPTIONS, TRANSACTION_TYPES_TABLE_LABEL } from '@/types/transactionTypes';
import { formatCurrency, formatDateBRII, getVisiblePages, PERIOD_FILTER_ALL, PERIOD_FILTER_OPTIONS } from '@/lib/utils';
import { AuthLayout } from '@/components/custom/authLayout';
import { H1, Body } from '@/components/designSystem/typography';
import { Button } from '@/components/ui/button';
import { CircleArrowUp, Plus, Trash2, CircleArrowDown, SquarePen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SelectField } from '@/components/ui/select';
import { PaginationNextButton, PaginationPrevButton } from '@/components/ui/pagination-button';
import { IconButton } from '@/components/ui/icon-button';
import { TagPill } from '@/components/custom/tagPill';
import { CategoryIcon } from '@/components/custom/categoryIcon';
import { TransactionFormModal } from '@/components/form/transactionModal';
import { DeleteTransactionModal } from '@/components/form/deleteTransactionModal';
import '@/index.css';
import { CATEGORY_COLOR_LIST } from '@/constants';

const PAGE_LIMIT = 10;
const CATEGORY_FILTER = 'all';

export function TransactionsScreen() {
  const { transactions, loading: transactionsIsLoading, error, refetch } = useQueryTransactions();
  const { categories } = useQueryCategories();
  const {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loadingTransaction: transactionsMutationsIsLoading,
    errorTransaction: transactionsMutationsError
  } = useTransactionMutations(refetch);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState(TRANSACTION_FILTER_DEFAULT);
  const [categoryFilter, setCategoryFilter] = useState(CATEGORY_FILTER);
  const [periodFilter, setPeriodFilter] = useState(PERIOD_FILTER_ALL);
  const [currentPage, setCurrentPage] = useState(1);

  const [formVisible, setFormVisible] = useState(false);
  const [formDeletingVisible, setFormDeletingVisible] = useState(false);
  const [formType, setFormType] = useState<'create' | 'edit'>('create');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  const CATEGORY_FILTER_OPTIONS = useMemo(() => [
    { value: CATEGORY_FILTER, label: 'Todas' },
    ...categories?.map((c: Category) => ({ value: c.id, label: c.title })),
  ], [categories]);

  const PERIOD_OPTIONS = useMemo(() => [
    { value: PERIOD_FILTER_ALL, label: 'Todos' },
    ...PERIOD_FILTER_OPTIONS?.map((c: any) => ({ value: c.value, label: c.label })),
  ], [PERIOD_FILTER_OPTIONS]);

  const filteredTransactions = useMemo(() => {
    return transactions?.filter((t: Transaction) => {
      const matchesSearchQuery = t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTypeFilter = typeFilter === TRANSACTION_FILTER_DEFAULT || t.type === typeFilter;
      const matchesCategoryFilter = categoryFilter === CATEGORY_FILTER || t.categoryId === categoryFilter;
      let matchesPeriodFilter = true;
      if (periodFilter !== PERIOD_FILTER_ALL) {
        const dateTransaction = t.date.split('T')[0];
        matchesPeriodFilter = dateTransaction.startsWith(periodFilter);
      }
      return matchesSearchQuery && matchesTypeFilter && matchesCategoryFilter && matchesPeriodFilter;
    }) ?? [];
  }, [transactions, searchQuery, typeFilter, categoryFilter, periodFilter]);

  const totalFilteredTransactions = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredTransactions / PAGE_LIMIT));
  const startIndex = (currentPage - 1) * PAGE_LIMIT;
  const endIndex = Math.min(startIndex + PAGE_LIMIT, totalFilteredTransactions);
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  async function handleActionTransaction(type: 'create' | 'edit' | 'delete', data?: Transaction) {
    if (type === 'create') {
      setFormVisible(true);
      setFormType('create');
      setEditingTransaction(null);
    }
    else if (type === 'edit') {
      setFormVisible(true);
      setFormType('edit');
      setEditingTransaction(data ?? null);
    }
    else if (type === 'delete') {
      setFormDeletingVisible(true);
      setDeletingTransaction(data ?? null);
    }
  }

  async function handleFormSubmit(data: CreateTransactionInput) {
    if (formType === 'create') {
      await createTransaction({
        description: data?.description,
        amount: data?.amount,
        categoryId: data?.categoryId,
        date: data?.date,
        type: data?.type as TransactionType
      });
    } else if (editingTransaction && formType === 'edit') {
      await updateTransaction(editingTransaction.id, {
        description: data?.description,
        amount: data?.amount,
        categoryId: data?.categoryId,
        date: data?.date,
        type: data?.type as TransactionType
      });
    }
    setFormVisible(false);
    setEditingTransaction(null);
  }

  async function handleDeleteConfirm(data: Transaction) {
    await deleteTransaction(data.id);
    setFormDeletingVisible(false);
    setDeletingTransaction(null);
  }

  const deleteErrorMessage = transactionsMutationsError
    ? transactionsMutationsError?.message ?? 'Falha na tentativa de excluir a transação.'
    : null;

  return (
    <AuthLayout>
      <div className='space-y-8'>
        <div className=' flex flex-col gap-4 sm:flex-row sm:items-center justify-between'>
          <div>
            <H1 className='text-xl font-semibold'>Transações</H1>
            <Body className='text-muted-foreground mt-1'>
              Gerencie todas as suas transações financeiras
            </Body>
          </div>
          <Button
            className='shrink-0 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-brand-dark'
            onClick={() => handleActionTransaction('create')}>
            <Plus />
            Nova Transação
          </Button>
        </div>

        {transactionsIsLoading && <Body>Carregando...</Body>}
        {error && <Body className='text-destructive'>{error.message ?? 'Ocorreu um erro'}</Body>}

        {
          !transactionsIsLoading && !error && (
            <>
              <Card>
                <CardContent className='pt-6'>
                  <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-4'>
                    <Input
                      label='Buscar'
                      placeholder='Buscar por descrição'
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1);
                      }}
                      autoComplete='off'
                      className='w-full'
                    />
                    <SelectField
                      label='Tipo'
                      placeholder='tipo'
                      value={typeFilter}
                      onValueChange={(e) => {
                        setTypeFilter(e)
                        setCurrentPage(1);
                      }}
                      options={TRANSACTION_TYPE_OPTIONS}
                      containerClassName='w-full'
                    />
                    <SelectField
                      label='Categoria'
                      placeholder='categoria'
                      value={categoryFilter}
                      onValueChange={(e) => {
                        setCategoryFilter(e)
                        setCurrentPage(1);
                      }}
                      options={CATEGORY_FILTER_OPTIONS}
                      containerClassName='w-full'
                    />
                    <SelectField
                      label='Período'
                      placeholder='Período'
                      value={periodFilter}
                      onValueChange={(e) => {
                        setPeriodFilter(e)
                        setCurrentPage(1);
                      }}
                      options={PERIOD_OPTIONS}
                      containerClassName='w-full'
                    />
                  </div>
                </CardContent>
              </Card>

              {
                transactions.length === 0 ? (
                  <Card>
                    <CardContent className='py-8'>
                      <Body className='text-muted-foreground text-center'>
                        Nenhuma transação encontrada
                      </Body>
                    </CardContent>
                  </Card>
                ) : filteredTransactions.length === 0 ? (
                  <Card>
                    <CardContent className='py-8'>
                      <Body className='text-muted-foreground text-center'>
                        Nenhuma transação encontrada com os filtros aplicados
                      </Body>
                    </CardContent>
                  </Card>
                ) : (
                  <div className='border border-input rounded-md'>
                    <table className='w-full text-sm bg-white rounded-md'>
                      <thead>
                        <tr className='bg-muted/50 border-b border-input'>
                          <th className='py-3 px-10 uppercase text-muted-foreground text-xs text-left font-medium'>
                            Descrição
                          </th>
                          <th className='py-3 px-2 uppercase text-muted-foreground text-xs text-center font-medium'>
                            Data
                          </th>
                          <th className='py-3 px-4 uppercase text-muted-foreground text-xs text-center font-medium'>
                            Categoria
                          </th>
                          <th className='py-3 px-2 uppercase text-muted-foreground text-xs text-center font-medium'>
                            Tipo
                          </th>
                          <th className='py-3 px-4 uppercase text-muted-foreground text-xs text-right font-medium'>
                            Valor
                          </th>
                          <th className='py-3 px-4 uppercase text-muted-foreground text-xs text-right font-medium'>
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          paginatedTransactions.map((transaction: Transaction) => (
                            <tr key={transaction.id} className='border-b border-input'>
                              <td className='py-3 px-10'>
                                <div className='flex items-center gap-2'>
                                  <div
                                    className='flex items-center justify-center h-8 w-8 shrink-0 text-gray-600 rounded-lg'
                                    style={{
                                      backgroundColor: transaction.category?.color
                                        ? `${transaction.category?.color}`
                                        : '#e5e7eb'
                                    }}
                                    aria-hidden>
                                    <CategoryIcon
                                      iconName={transaction.category?.icon ?? 'Folder'}
                                      className='text-gray-500'
                                      style={{
                                        color: CATEGORY_COLOR_LIST.find(color => color.value === transaction.category?.color)?.base ?? 'black'
                                      }}
                                      size={16} />
                                  </div>
                                  <span className='font-semibold text-foreground'>
                                    {transaction.description}
                                  </span>
                                </div>
                              </td>
                              <td className='py-3 px-2 justify-center text-center text-muted-foreground'>
                                {formatDateBRII(transaction.date)}
                              </td>
                              <td className='py-3 px-4 justify-center text-center text-muted-foreground'>
                                {
                                  transaction.category ? (
                                    <TagPill
                                      label={transaction.category.title}
                                      color={transaction.category.color ?? '#9ca3af'}
                                      className="font-semibold"
                                      textColor={CATEGORY_COLOR_LIST.find(color => color.value === transaction.category?.color)?.base ?? 'black'} />
                                  ) : '-'
                                }
                              </td>
                              <td className='py-3 px-2'>
                                <span className={`flex items-center justify-center gap-1 ${transaction.type === 'EXPENSE' ? 'text-destructive' : 'text-green-600'}`}>
                                  {
                                    transaction.type === 'EXPENSE' ? (
                                      <CircleArrowDown className='w-4 h-4 text-destructive' />
                                    ) : (
                                      <CircleArrowUp className='w-4 h-4 text-green-600' />
                                    )
                                  }
                                  {TRANSACTION_TYPES_TABLE_LABEL[transaction.type]}
                                </span>
                              </td>
                              <td className='py-3 px-2 text-right'>
                                <span className='text-foreground font-semibold'>
                                  {`${transaction.type === 'EXPENSE' ? '-' : '+'} R$ ${formatCurrency(Math.abs(transaction.amount))}`}
                                </span>
                              </td>
                              <td className='py-3 px-2'>
                                <div className='flex gap-1 shrink-0 justify-end'>
                                  <IconButton
                                    className="text-destructive"
                                    aria-label="Excluir transação"
                                    onClick={() => handleActionTransaction('delete', transaction)}>
                                    <Trash2 className='w-4 h-4' />
                                  </IconButton>
                                  <IconButton
                                    aria-label="Editar transação"
                                    onClick={() => handleActionTransaction('edit', transaction)}>
                                    <SquarePen className='w-4 h-4' />
                                  </IconButton>
                                </div>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                      <tfoot>
                        <tr className='bg-muted/30 border-t border-input'>
                          <td colSpan={6} className='py-3 px-4 text-muted-foreground'>
                            <div className='flex justify-between items-center gap-4'>
                              <Body className='text-muted-foreground'>
                                {
                                  `${startIndex + 1} a ${endIndex} | ${totalFilteredTransactions} resultado${totalFilteredTransactions !== 1 ? 's' : ''}`
                                }
                              </Body>

                              <div className='flex items-center gap-1'>
                                <PaginationPrevButton
                                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                  disabled={currentPage === 1} />

                                {getVisiblePages(currentPage, totalPages).map((page) => (
                                  <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`
                                      flex h-8 w-8 items-center justify-center
                                      rounded-md text-xs
                                      ${currentPage === page
                                        ? 'bg-green-700 text-white'
                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                      }
                                    `}
                                  >
                                    {page}
                                  </button>
                                ))}

                                <PaginationNextButton
                                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                  disabled={currentPage === totalPages} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )
              }
            </>
          )
        }
      </div>

      <TransactionFormModal
        visible={formVisible}
        onVisibleChange={setFormVisible}
        mode={formType}
        transaction={formType === 'edit' ? editingTransaction : null}
        onSubmit={handleFormSubmit}
        loading={transactionsMutationsIsLoading}
        categories={categories} />

      <DeleteTransactionModal
        visible={formDeletingVisible}
        onVisibleChange={setFormDeletingVisible}
        transaction={deletingTransaction}
        onConfirm={handleDeleteConfirm}
        loading={transactionsMutationsIsLoading}
        errorMessage={deleteErrorMessage} />
    </AuthLayout>
  )
}
