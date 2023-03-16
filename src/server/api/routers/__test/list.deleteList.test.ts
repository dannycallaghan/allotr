import { test, expect } from '@jest/globals';
import { appRouter } from '../../root';
import { prisma } from '../../../db';
import { mockSession } from './testutils';
import type { List, PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

test('deleteList: Unauthenticated user should throw UNAUTHORIZED error', async () => {
  const caller = appRouter.createCaller({ session: null, prisma: prisma });

  const input = { id: '123', authorId: '456' };

  try {
    await caller.list.deleteList(input);
  } catch (error) {
    expect(error).toHaveProperty('name', 'TRPCError');
    expect(error).toHaveProperty('code', 'UNAUTHORIZED');
  }
});

test('deleteList: Only list creator can delete a list', async () => {
  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prisma,
  });

  const input = { id: '123', authorId: '456' };

  try {
    await caller.list.deleteList(input);
  } catch (error) {
    expect(error).toHaveProperty('code', 'UNAUTHORIZED');
    expect(error).toHaveProperty(
      'message',
      'Only the list author can delete the list.',
    );
  }
});

test('deleteList: List creator can delete a list', async () => {
  const prismaMock = mockDeep<PrismaClient>();

  const input = {
    id: '123',
    authorId: mockSession.user?.id as string,
  };

  const output: List = {
    ...input,
    title: 'This is a list title',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  prismaMock.list.delete.mockResolvedValue(output);

  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prismaMock,
  });

  const result = await caller.list.deleteList(input);

  expect(result).toStrictEqual(output);
});
