import { z } from 'zod';

export const categorySchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  color: z.string().min(1, 'Cor é obrigatória'),
});