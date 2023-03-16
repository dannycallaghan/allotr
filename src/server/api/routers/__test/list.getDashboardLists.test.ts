import { test, expect } from '@jest/globals';
import { appRouter } from '../../root';
import { prisma } from '../../../db';
import type { List } from '@prisma/client';
import { mockEmptySession, mockSession } from './testutils';

test('getDashboardLists: Unauthenticated user should throw UNAUTHORIZED error', async () => {
  const caller = appRouter.createCaller({ session: null, prisma: prisma });

  try {
    await caller.list.getDashboardLists();
  } catch (error) {
    expect(error).toHaveProperty('name', 'TRPCError');
    expect(error).toHaveProperty('code', 'UNAUTHORIZED');
  }
});

test('getDashboardLists: Fake user should return an empty array of lists', async () => {
  const caller = appRouter.createCaller({
    session: mockEmptySession,
    prisma: prisma,
  });

  const result = await caller.list.getDashboardLists();

  expect(result).toHaveLength(0);
});

test('getDashboardLists: Test user should return an array of lists created by test user', async () => {
  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prisma,
  });

  const result = await caller.list.getDashboardLists();

  expect(result).not.toHaveLength(0);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const firstList: List = result[0];

  expect(firstList).toHaveProperty('id');
  expect(firstList).toHaveProperty('title');
  expect(firstList).toHaveProperty('description');
  expect(firstList).toHaveProperty('authorId', mockSession.user?.id as string);
});
