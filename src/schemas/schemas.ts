import { z } from 'zod';

export const createListSchema = z.object({
  title: z
    .string()
    .min(10, { message: 'Must be 10 or more characters.' })
    .max(256, { message: 'Maximum length is 256 characters.' })
    .trim(),
  description: z
    .string()
    .max(500, { message: 'Maximum length is 500 characters.' })
    .trim(),
});

export const updateListDetailsSchema = z.object({
  id: z.string().trim(),
  title: z
    .string()
    .min(10, { message: 'Must be 10 or more characters.' })
    .max(256, { message: 'Maximum length is 256 characters.' })
    .trim(),
  description: z
    .string()
    .max(500, { message: 'Maximum length is 500 characters.' })
    .trim(),
});
