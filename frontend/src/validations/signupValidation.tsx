import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres')
});