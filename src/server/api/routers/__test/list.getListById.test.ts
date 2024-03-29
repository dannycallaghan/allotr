import { test, expect } from '@jest/globals';
import type { AppRouter } from '../../root';
import { appRouter } from '../../root';
import { prisma } from '../../../db';
import type { inferProcedureInput } from '@trpc/server';
import { mockDeep } from 'jest-mock-extended';
import type { List, PrismaClient } from '@prisma/client';
import { mockListOutput, testListId } from './testutils';

test('getListById: Unknown list ID should return null', async () => {
  const caller = appRouter.createCaller({ session: null, prisma: prisma });

  type Input = inferProcedureInput<AppRouter['list']['getListById']>;

  const id = '123';

  const input: Input = {
    id,
  };

  const result = await caller.list.getListById(input);

  expect(result).toBeNull();
});

test('getListById: Correct list ID should return list details', async () => {
  const prismaMock = mockDeep<PrismaClient>();

  const mockOutput: List = mockListOutput;

  prismaMock.list.findUnique.mockResolvedValue(mockOutput);

  const caller = appRouter.createCaller({ session: null, prisma: prismaMock });

  type Input = inferProcedureInput<AppRouter['list']['getListById']>;

  const id = mockOutput.id;

  const input: Input = {
    id,
  };

  const result = await caller.list.getListById(input);

  expect(result).toStrictEqual(mockOutput);
});

test('getListById: List details should include tasks and author details', async () => {
  const caller = appRouter.createCaller({ session: null, prisma: prisma });

  type Input = inferProcedureInput<AppRouter['list']['getListById']>;

  const id = testListId;

  const input: Input = {
    id,
  };

  const result = await caller.list.getListById(input);

  expect(result).toHaveProperty('tasks');
  expect(result).toHaveProperty('user');
});
