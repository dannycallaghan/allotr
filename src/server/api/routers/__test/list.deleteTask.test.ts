import { test, expect } from '@jest/globals';
import { appRouter } from '../../root';
import { prisma } from '../../../db';
import { mockSession } from './testutils';
import type { PrismaClient, Task } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

test('deleteTask: Unauthenticated user should throw UNAUTHORIZED error', async () => {
  const caller = appRouter.createCaller({ session: null, prisma: prisma });

  const input = { id: '123', authorId: '456' };

  try {
    await caller.list.deleteTask(input);
  } catch (error) {
    expect(error).toHaveProperty('name', 'TRPCError');
    expect(error).toHaveProperty('code', 'UNAUTHORIZED');
  }
});

test('deleteTask: Only list creator can delete a list', async () => {
  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prisma,
  });

  const input = { id: '123', authorId: '456' };

  try {
    await caller.list.deleteTask(input);
  } catch (error) {
    expect(error).toHaveProperty('code', 'UNAUTHORIZED');
    expect(error).toHaveProperty(
      'message',
      'Only the task author can delete the task.',
    );
  }
});

test('deleteTask: List creator can delete a list', async () => {
  const prismaMock = mockDeep<PrismaClient>();

  const input = {
    id: '123',
    authorId: mockSession.user?.id as string,
  };

  const output: Task = {
    ...input,
    title: 'This is a task title',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    isComplete: false,
    listId: '',
    dueDate: null,
    comment: null,
    attachments: null,
    assigneeId: null,
    suggestedAssignee: null,
    claimed: false,
    priority: 0,
  };

  prismaMock.task.delete.mockResolvedValue(output);

  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prismaMock,
  });

  const result = await caller.list.deleteTask(input);

  expect(result).toStrictEqual(output);
});
