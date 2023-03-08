import { test, expect } from '@jest/globals';
import type { AppRouter } from '../../root';
import { appRouter } from '../../root';
import { prisma } from '../../../db';
import type { inferProcedureInput } from '@trpc/server';
// import { createTRPCContext } from '../../trpc';

const testListId = 'clezsox4a0000kz081qkelqhq';

test('getListById: Unknown list ID should return "List not found: <id>"', async () => {
  const caller = appRouter.createCaller({ session: null, prisma: prisma });

  type Input = inferProcedureInput<AppRouter['list']['getListById']>;

  const id = '123';

  const input: Input = {
    id,
  };

  const result = await caller.list.getListById(input);

  expect(result).toEqual(`List not found: ${id}`);
});

test('getListById: Correct list ID should return list details', async () => {
  const caller = appRouter.createCaller({ session: null, prisma: prisma });

  type Input = inferProcedureInput<AppRouter['list']['getListById']>;

  const id = testListId;

  const input: Input = {
    id,
  };

  const result = await caller.list.getListById(input);

  expect(result).toHaveProperty('id', id);
  expect(result).toHaveProperty('title');
  expect(result).toHaveProperty('description', id);
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
