import { test, expect } from '@jest/globals';
import type { AppRouter } from '../../root';
import { appRouter } from '../../root';
import { prisma } from '../../../db';
import type { inferProcedureInput } from '@trpc/server';
import { mockDeep } from 'jest-mock-extended';
import type { PrismaClient, Task } from '@prisma/client';
import { mockTaskOutput, testTaskId } from './testutils';

test('getTaskById: Unknown task ID should return null', async () => {
  const caller = appRouter.createCaller({ session: null, prisma: prisma });

  type Input = inferProcedureInput<AppRouter['task']['getTaskById']>;

  const id = '123';

  const input: Input = {
    id,
  };

  const result = await caller.task.getTaskById(input);

  expect(result).toBeNull();
});

test('getTaskById: Correct list ID should return task details', async () => {
  const prismaMock = mockDeep<PrismaClient>();

  const mockOutput: Task = mockTaskOutput;

  prismaMock.task.findUnique.mockResolvedValue(mockOutput);

  const caller = appRouter.createCaller({ session: null, prisma: prismaMock });

  type Input = inferProcedureInput<AppRouter['task']['getTaskById']>;

  const id = mockOutput.id;

  const input: Input = {
    id,
  };

  const result = await caller.task.getTaskById(input);

  expect(result).toStrictEqual(mockOutput);
});

test('getTaskById: Task details should include author details', async () => {
  const caller = appRouter.createCaller({ session: null, prisma: prisma });

  type Input = inferProcedureInput<AppRouter['task']['getTaskById']>;

  const id = testTaskId;

  const input: Input = {
    id,
  };

  const result = await caller.task.getTaskById(input);

  expect(result).toHaveProperty('user');
});
