import type { z } from 'zod';
import type {
  createListSchema,
  updateListDetailsSchema,
} from '../schemas/schemas';

export type CreateListInput = z.TypeOf<typeof createListSchema>;

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null | Date;
  image: string | null;
};

export type UpdateListDetailsInput = z.TypeOf<typeof updateListDetailsSchema>;
