import { test, expect } from '@jest/globals';
import type { AppRouter } from '../../root';
import { appRouter } from '../../root';
import { prisma } from '../../../db';
import type { inferProcedureInput } from '@trpc/server';
import type { CreateTaskInput } from './testutils';
import {
  mockSession,
  longText,
  mockTaskInput,
  mockTaskOutput,
} from './testutils';
import type { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

test('createTask: Unauthenticated user should throw UNAUTHORIZED error', async () => {
  const caller = appRouter.createCaller({ session: null, prisma: prisma });

  type Input = inferProcedureInput<AppRouter['task']['createTask']>;

  const input: Input = {
    title: 'Test list',
    description: 'Test list description',
    listId: '',
    dueDate: null,
    comment: null,
    attachments: null,
    suggestedAssignee: null,
  };

  try {
    await caller.task.createTask(input);
  } catch (error) {
    expect(error).toHaveProperty('code', 'UNAUTHORIZED');
  }
});

test('createTask: Authenticated user can create task and have task ID returned', async () => {
  const prismaMock = mockDeep<PrismaClient>();

  prismaMock.task.create.mockResolvedValue(mockTaskOutput);

  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prismaMock,
  });

  const result = await caller.task.createTask(mockTaskInput);

  expect(result).toStrictEqual(mockTaskOutput);
});

test('createTask: Task title must be 6 characters or more', async () => {
  const prismaMock = mockDeep<PrismaClient>();

  prismaMock.task.create.mockResolvedValue(mockTaskOutput);

  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prismaMock,
  });

  const input: CreateTaskInput = {
    title: 'Test',
    description: 'Test list description',
    listId: '',
    dueDate: null,
    comment: null,
    attachments: null,
    suggestedAssignee: null,
  };

  try {
    await caller.task.createTask(input);
  } catch (error) {
    expect(error).toHaveProperty('name', 'TRPCError');
    expect(error).toHaveProperty('code', 'BAD_REQUEST');
  }
});

test('createTask: Task title must be less than 256 characters', async () => {
  const prismaMock = mockDeep<PrismaClient>();

  prismaMock.task.create.mockResolvedValue(mockTaskOutput);

  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prismaMock,
  });

  const input: CreateTaskInput = {
    title: longText,
    description: '',
    listId: '',
    dueDate: null,
    comment: null,
    attachments: null,
    suggestedAssignee: null,
  };

  try {
    await caller.task.createTask(input);
  } catch (error) {
    expect(error).toHaveProperty('name', 'TRPCError');
    expect(error).toHaveProperty('code', 'BAD_REQUEST');
  }
});

test('createTask: Task description must be less than 1024 characters', async () => {
  const prismaMock = mockDeep<PrismaClient>();

  prismaMock.task.create.mockResolvedValue(mockTaskOutput);

  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prismaMock,
  });

  const input: CreateTaskInput = {
    title: 'This is a test task',
    description: longText,
    listId: '',
    dueDate: null,
    comment: null,
    attachments: null,
    suggestedAssignee: null,
  };

  try {
    await caller.task.createTask(input);
  } catch (error) {
    expect(error).toHaveProperty('name', 'TRPCError');
    expect(error).toHaveProperty('code', 'BAD_REQUEST');
  }
});

test('createTask: Task comment must be less than 1024 characters', async () => {
  const prismaMock = mockDeep<PrismaClient>();

  prismaMock.task.create.mockResolvedValue(mockTaskOutput);

  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prismaMock,
  });

  const input: CreateTaskInput = {
    title: 'This is a test task',
    description: '',
    listId: '',
    dueDate: null,
    comment: longText,
    attachments: null,
    suggestedAssignee: null,
  };

  try {
    await caller.task.createTask(input);
  } catch (error) {
    expect(error).toHaveProperty('name', 'TRPCError');
    expect(error).toHaveProperty('code', 'BAD_REQUEST');
  }
});
