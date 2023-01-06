import type { z } from 'zod';
import type { createListSchema } from '../schemas/schemas';

export type CreatePostInput = z.TypeOf<typeof createListSchema>;
