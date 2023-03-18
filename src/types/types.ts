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

export type List = {
  id?: string;
  title: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  user?: User | null;
  authorId?: string;
  description: string | null;
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
  description: string | null;
  comment: string | null;
  attachments: string | null;
  suggestedAssignee: string | null;
  claimed: boolean;
  assignee?: User | null;
  priority: number;
  assigneeId?: string | null;
};

export type CreateTaskInput = z.TypeOf<typeof createTaskSchema>;
