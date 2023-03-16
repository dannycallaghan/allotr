import { test, expect } from '@jest/globals';
import { appRouter } from '../../root';
import { prisma } from '../../../db';
import type { List } from '@prisma/client';
import { mockEmptySession, mockSession } from './testutils';

test('getDashboardTasks: Unauthenticated user should throw UNAUTHORIZED error', async () => {
  const caller = appRouter.createCaller({ session: null, prisma: prisma });

  try {
    await caller.list.getDashboardTasks();
  } catch (error) {
    expect(error).toHaveProperty('name', 'TRPCError');
    expect(error).toHaveProperty('code', 'UNAUTHORIZED');
  }
});

test('getDashboardTasks: Fake user should return an empty array of tasks', async () => {
  const caller = appRouter.createCaller({
    session: mockEmptySession,
    prisma: prisma,
  });

  const result = await caller.list.getDashboardTasks();

  expect(result).toHaveLength(0);
});

test('getDashboardTasks: Test user should return an array of tasks claimed by test user', async () => {
  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prisma,
  });

  const result = await caller.list.getDashboardTasks();

  expect(result).not.toHaveLength(0);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const firstList: List = result[0];

  expect(firstList).toHaveProperty('id');
  expect(firstList).toHaveProperty('title');
  expect(firstList).toHaveProperty('claimed', true);
  expect(firstList).toHaveProperty(
    'assigneeId',
    mockSession.user?.id as string,
  );
});
