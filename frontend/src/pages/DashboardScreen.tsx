import { useMemo, useState } from 'react';
import { AuthLayout } from '@/components/custom/authLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Minus, Plus, Wallet } from 'lucide-react';
import { Body } from '@/components/designSystem/typography';
import { useQueryTransactions } from '@/hooks/useQueryTransactions';
import { useQueryCategories } from '@/hooks/useQueryCategories';
import { formatCurrency, formatDateBRII } from '@/lib/utils';
import { TagPill } from '@/components/custom/tagPill';
import { Button } from '@/components/ui/button';
import { CategoryIcon } from '@/components/custom/categoryIcon';

import '@/index.css';

function getMonthPrefix(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${year}-${month}`;
}

function calculateBalances(transactions: any[]) {
  const monthPrefix = getMonthPrefix();
  return useMemo(() => {
    let totalBalance = 0;
    let monthIncome = 0;
    let monthExpenses = 0;

    for (const transaction of transactions) {
      const dateTransaction = transaction.date.split('T')[0] ?? transaction.date;
      const isMonthTransaction = dateTransaction.startsWith(monthPrefix);

      if (transaction.type === 'INCOME') {
        totalBalance += transaction.amount;
        if(isMonthTransaction) { monthIncome += transaction.amount; }
      } else {
        totalBalance -= transaction.amount;
        if(isMonthTransaction) { monthExpenses += transaction.amount; }
      }
    }

    return [totalBalance, monthIncome, monthExpenses];
  }, [transactions, monthPrefix]);
}

function useCategoryAnalysis(categories: any[], transactions: any[]) {
  return useMemo(() => {
    const categoryIndex = new Map<string, {
      count: number;
      total: number;
      title: string;
      color: string;
    }>();

    for (const itemCt of categories) {
      categoryIndex.set(itemCt.id, {
        count: 0,
        total: 0,
        title: itemCt.title,
        color: itemCt.color,
      });
    }

    for (const itemTr of transactions) {
      const category = categoryIndex.get(itemTr.categoryId);
      if (category) {
        category.count += 1;
        if(itemTr.type === 'EXPENSE') { category.total += itemTr.amount; }
      }
    }

    const result = [...categoryIndex.entries()]
      .map(([id, data]) => ({ id, ...data }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return result;
  }, [transactions, categories]);
}


export function DashboardScreen() {
  const [modalOpen, setModalOpen] = useState(false)
  const {
    transactions,
    loading: transactionsIsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useQueryTransactions();
  const {
    categories,
    loading: categoriesIsLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQueryCategories();

  const [totalBalance, monthIncome, monthExpenses] = calculateBalances(transactions);
  const categoryAnalysis = useCategoryAnalysis(categories, transactions);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => (b.date.localeCompare(a.date)))
      .slice(0, 5);
  }, [transactions]);

  return (
    <AuthLayout>
      <div className='space-y-8'>
        <div className='grid gap-4 sm:grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-start space-y-0 gap-2 pb-2'>
              <Wallet className='w-5 h-5 shrink-0 text-purple-base' aria-hidden />
              <CardTitle className='text-sm font-medium text-muted-foreground uppercase'>Saldo Total</CardTitle>
            </CardHeader>
            <CardContent>
              {
                transactionsIsLoading ? (
                  <Body className='text-2xl font-semibold text-muted-foreground'>
                    Carregando ...
                  </Body>
                ) : (
                  <Body className='text-2xl font-semibold text-foreground'>
                    {`R$ ${formatCurrency(Math.abs(totalBalance))}`}
                  </Body>
                )
              }
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-start space-y-0 gap-2 pb-2'>
              <Wallet className='w-5 h-5 shrink-0 text-green-600' aria-hidden />
              <CardTitle className='text-sm font-medium text-muted-foreground uppercase'>Receitas do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              {
                transactionsIsLoading ? (
                  <Body className='text-2xl font-semibold text-muted-foreground'>
                    Carregando ...
                  </Body>
                ) : (
                  <Body className='text-2xl font-semibold text-foreground'>
                    {`R$ ${formatCurrency(monthIncome)}`}
                  </Body>
                )
              }
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-start space-y-0 gap-2 pb-2'>
              <Wallet className='w-5 h-5 shrink-0 text-red-600' aria-hidden />
              <CardTitle className='text-sm font-medium text-muted-foreground uppercase'>Despesas do Mês  </CardTitle>
            </CardHeader>
            <CardContent>
              {
                transactionsIsLoading ? (
                  <Body className='text-2xl font-semibold text-muted-foreground'>
                    Carregando ...
                  </Body>
                ) : (
                  <Body className='text-2xl font-semibold text-foreground'>
                    {`R$ ${formatCurrency(monthExpenses)}`}
                  </Body>
                )
              }
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-8 grid-cols-1 lg:grid-cols-3'>
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="font-light text-gray-500">TRANSAÇÕES RECENTES</span>
                  <Link
                    to="/"
                    className="text-sm font-medium text-primary hover:underline">
                    Ver todas
                  </Link>
                </div>
                {transactionsIsLoading && (
                  <div className="py-8 text-center">
                    <Body className="text-muted-foreground">Carregando...</Body>
                  </div>
                )}
                {transactionsError && (
                  <div className="py-8 px-6">
                    <Body className="text-destructive">{transactionsError.message}</Body>
                  </div>
                )}
                {!transactionsIsLoading && !transactionsError && recentTransactions.length === 0 && (
                  <div className="py-8 text-center">
                    <Body className="text-muted-foreground">Nenhuma transação ainda.</Body>
                  </div>
                )}
                {!transactionsIsLoading && !transactionsError && recentTransactions.length > 0 && (
                  <ul className="divide-y divide-border">
                    {recentTransactions.map((trs) => (
                      <li key={trs.id} className="flex items-center gap-3 px-4 py-3">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: trs.category?.color ? `${trs.category.color}20` : '#e5e7eb' }}
                          aria-hidden>
                          <CategoryIcon
                            iconName={trs.category?.icon ?? 'Folder'}
                            size={16}
                            className="text-gray-500"
                            style={{ color: trs.category?.color ?? undefined }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">{trs.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDateBRII(trs.date)}</p>
                        </div>
                        {trs.category && (
                          <TagPill label={trs.category.title} color={trs.category.color ?? '#9ca3af'} />
                        )}
                        <div className="shrink-0 flex items-center gap-1.5">
                          <span className="font-semibold text-black">
                            {trs.type === 'EXPENSE' ? '-' : '+'} R${' '}
                            {formatCurrency(Math.abs(trs.amount))}
                          </span>
                          {trs.type === 'EXPENSE' ? (
                            <Minus className="h-4 w-4 text-red-600" aria-hidden />
                          ) : (
                            <Plus className="h-4 w-4 text-green-600" aria-hidden />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="border-t border-border px-4 py-3 flex justify-center">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary font-medium"
                    onClick={() => setModalOpen(true)}>
                    + Nova transação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='lg:col-span-1'>
            <Card>
              <CardContent className="p-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="font-light text-gray-500 uppercase">Categorias</span>
                  <Link
                    to="/"
                    className="text-sm font-medium text-primary hover:underline">
                    Gerenciar
                  </Link>
                </div>
                {categoriesIsLoading && (
                  <div className="py-8 text-center">
                    <Body className="text-muted-foreground">Carregando...</Body>
                  </div>
                )}
                {categoriesError && (
                  <div className="py-8 px-6">
                    <Body className="text-destructive">{categoriesError.message}</Body>
                  </div>
                )}
                {!categoriesIsLoading && !categoriesError && categoryAnalysis.length === 0 && (
                  <div className="py-8 text-center">
                    <Body className="text-muted-foreground">Nenhuma categoria com transações ainda.</Body>
                  </div>
                )}
                {!categoriesIsLoading && !categoriesError && categoryAnalysis.length > 0 && (
                  <ul className="divide-y divide-border">
                    {categoryAnalysis.map((category) => (
                      <li
                        key={category.id}
                        className="flex items-center justify-between gap-3 px-4 py-3">
                        <TagPill label={category.title} color={category.color} />
                        <span className="text-sm text-muted-foreground">
                          {category.count === 1 ? `${category.count} item` : `${category.count} itens`}
                        </span>
                        <span className="font-semibold text-foreground">
                          {`R$ ${formatCurrency(category.total)}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
