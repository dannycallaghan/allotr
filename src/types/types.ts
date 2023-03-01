import type { z } from 'zod';
import type {
  createListSchema,
  updateListDetailsSchema,
  createTaskSchema,
} from '../schemas/schemas';

export type CreateListInput = z.TypeOf<typeof createListSchema>;

export type User = {
  id: string | undefined;
  name: string | null;
  email: string | null;
  emailVerified?: string | null | Date;
  image: string | null;
};

export type UpdateListDetailsInput = z.TypeOf<typeof updateListDetailsSchema>;

export type Task = {
  id?: string;
  title: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isComplete: boolean;
  listId: string;
  user?: User | null;
  authorId?: string;
  dueDate: null | Date;
  description: string;
  comment: string;
  attachments: string;
  suggestedAssignee: string;
  claimed: boolean;
  assignee?: User | null;
  priority: number;
};

export type CreateTaskInput = z.TypeOf<typeof createTaskSchema>;
