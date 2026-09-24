export interface MonthYearList {
  value: string;
  label: string;
}

export function formatCurrency(value: number): string {
  const valueFormatted = value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return valueFormatted;
}

export function formatParseCurrency(value: string): number {
  const parsedReplace = value.replace(/\s/g, '').replace(/R\$/g, '').replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(parsedReplace);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function formatDateBRII(date: string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear().toString();
  return `${day}/${month}/${year.slice(-2)}`;
}

export const PERIOD_FILTER_ALL = 'all';

export function getMonthYear(): MonthYearList[] {
  const list: MonthYearList[] = [];
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = `${monthNames[date.getMonth()]} / ${date.getFullYear()}`;
    list.push({ value, label });
  }
  
  return list;
}

export const PERIOD_FILTER_OPTIONS = getMonthYear();