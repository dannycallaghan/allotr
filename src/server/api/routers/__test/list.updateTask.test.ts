import { test, expect } from '@jest/globals';
import { appRouter } from '../../root';
import { prisma } from '../../../db';
import type { UpdateTaskInput } from './testutils';
import { mockSession, mockTaskUpdateInput } from './testutils';
import type { Task, PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

test('updateTask: Unauthenticated user should throw UNAUTHORIZED error', async () => {
  const caller = appRouter.createCaller({ session: null, prisma: prisma });

  try {
    await caller.list.updateTask(mockTaskUpdateInput);
  } catch (error) {
    expect(error).toHaveProperty('name', 'TRPCError');
    expect(error).toHaveProperty('code', 'UNAUTHORIZED');
  }
});

test('updateTask: User who is not a creator or assignee of a claimed task should throw UNAUTHORIZED error (creator test)', async () => {
  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prisma,
  });

  const input: UpdateTaskInput = {
    ...mockTaskUpdateInput,
    authorId: '123',
  };

  try {
    await caller.list.updateTask(input);
  } catch (error) {
    expect(error).toHaveProperty('code', 'UNAUTHORIZED');
    expect(error).toHaveProperty(
      'message',
      'Only the task creator or task assignee can update the task.',
    );
  }
});

test('updateTask: User who is not a creator or assignee of a claimed task should throw UNAUTHORIZED error (assignee test - not claimed)', async () => {
  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prisma,
  });

  const input: UpdateTaskInput = {
    ...mockTaskUpdateInput,
    claimed: false,
  };

  try {
    await caller.list.updateTask(input);
  } catch (error) {
    expect(error).toHaveProperty('code', 'UNAUTHORIZED');
    expect(error).toHaveProperty(
      'message',
      'Only the task creator or task assignee can update the task.',
    );
  }
});

test('updateTask: User who is not a creator or assignee of a claimed task should throw UNAUTHORIZED error (assignee test - incorrect assignee)', async () => {
  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prisma,
  });

  const input: UpdateTaskInput = {
    ...mockTaskUpdateInput,
    claimed: true,
    assigneeId: '123',
  };

  try {
    await caller.list.updateTask(input);
  } catch (error) {
    expect(error).toHaveProperty('code', 'UNAUTHORIZED');
    expect(error).toHaveProperty(
      'message',
      'Only the task creator or task assignee can update the task.',
    );
  }
});

test('updateTask: Task creator can update task', async () => {
  const prismaMock = mockDeep<PrismaClient>();

  const input: UpdateTaskInput = {
    ...mockTaskUpdateInput,
    title: 'I have just updated the title',
    authorId: mockSession?.user?.id as string,
    isComplete: false,
    claimed: false,
    priority: 0,
  };

  const output: Task = {
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
    isComplete: false,
    claimed: false,
    priority: 0,
  };

  prismaMock.task.update.mockResolvedValue(output);

  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prismaMock,
  });

  const result = await caller.list.updateTask(input);

  expect(result).toStrictEqual(output);
});

test('updateTask: Assignee of a claimed task can update task', async () => {
  const prismaMock = mockDeep<PrismaClient>();

  const input: UpdateTaskInput = {
    ...mockTaskUpdateInput,
    title: 'I have just updated the title',
    authorId: '123',
    assigneeId: mockSession?.user?.id as string,
    claimed: true,
    isComplete: false,
    priority: 0,
  };

  const output: Task = {
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
    isComplete: false,
    claimed: true,
    priority: 0,
  };

  prismaMock.task.update.mockResolvedValue(output);

  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prismaMock,
  });

  const result = await caller.list.updateTask(input);

  expect(result).toStrictEqual(output);
});
