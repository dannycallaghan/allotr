import type { StringValidation, z } from 'zod';
import type {
  createListSchema,
  updateListDetailsSchema,
  createTaskSchema,
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

export type Task = {
  id: string;
  title: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  isComplete: boolean;
  listId: string;
  user: User;
  authorId: string;
  dueDate: null | Date;
  description: string;
  assignee: string;
  comment: string;
  attachments: string;
  claimed: boolean;
};

export type CreateTaskInput = z.TypeOf<typeof createTaskSchema>;
