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