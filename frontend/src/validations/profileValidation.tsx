import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
});