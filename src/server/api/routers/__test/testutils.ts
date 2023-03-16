import type { List, Task } from '@prisma/client';
import { inferProcedureInput } from '@trpc/server';
import type { Session } from 'next-auth';
import { AppRouter } from '../../root';

export const testListId = 'clfbap3eb0000p2uqkuszbgyu';
export const testTaskId = 'clfbaqg7a0002p2uq3a3d6327';

export const mockSession: Session = {
  expires: new Date().toISOString(),
  user: {
    id: 'clfaxpri40000p2p2xharmbiv',
  },
};

export const mockEmptySession: Session = {
  expires: new Date().toISOString(),
  user: {
    id: 'abc',
  },
};

export const mockListOutput: List = {
  id: '123',
  title: 'This is a test list',
  description: 'Test list description',
  createdAt: new Date(),
  updatedAt: new Date(),
  authorId: mockSession?.user?.id as string,
};

export type CreateListInput = inferProcedureInput<
  AppRouter['list']['createList']
>;

export const mockListInput: CreateListInput = {
  title: mockListOutput.title,
  description: mockListOutput.description,
};

export const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum fermentum a lectus nec gravida. Aenean hendrerit nisl in urna molestie, at accumsan mi vestibulum. Etiam laoreet, ante vitae hendrerit iaculis, sem velit aliquam eros, vel tempus elit metus eget justo. Fusce volutpat lorem a vestibulum venenatis. Nunc finibus malesuada pellentesque. Phasellus nisl mi, efficitur accumsan est vel, convallis hendrerit turpis. Aliquam et sem et augue auctor luctus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum fermentum a lectus nec gravida. Aenean hendrerit nisl in urna molestie, at accumsan mi vestibulum. Etiam laoreet, ante vitae hendrerit iaculis, sem velit aliquam eros, vel tempus elit metus eget justo. Fusce volutpat lorem a vestibulum venenatis. Nunc finibus malesuada pellentesque. Phasellus nisl mi, efficitur accumsan est vel, convallis hendrerit turpis. Aliquam et sem et augue auctor luctus.';

export type UpdateListInput = inferProcedureInput<
  AppRouter['list']['updateListDetails']
>;

export const mockListUpdateInput: UpdateListInput = {
  id: '123',
  title: 'This is a test list',
  description: 'Test list description',
  authorId: '456',
};

export const mockTaskOutput: Task = {
  id: '123',
  title: 'This is a test task',
  createdAt: new Date(),
  updatedAt: new Date(),
  isComplete: false,
  listId: '123',
  authorId: mockSession?.user?.id as string,
  claimed: false,
  priority: 0,
  dueDate: null,
  description: null,
  comment: null,
  attachments: null,
  assigneeId: null,
  suggestedAssignee: null,
};

export type CreateTaskInput = inferProcedureInput<
  AppRouter['list']['createTask']
>;

export const mockTaskInput: CreateTaskInput = {
  title: mockTaskOutput.title,
  listId: mockTaskOutput.listId,
  description: null,
  dueDate: null,
  comment: null,
  attachments: null,
  suggestedAssignee: null,
};

export type UpdateTaskInput = inferProcedureInput<
  AppRouter['list']['updateTask']
>;

export const mockTaskUpdateInput: UpdateTaskInput = {
  id: '123',
  title: 'This is a test task',
  description: null,
  listId: '456',
  dueDate: null,
  comment: null,
  attachments: null,
  suggestedAssignee: null,
  authorId: '',
  assigneeId: null,
  claimed: false,
  isComplete: false,
  priority: 0,
};
