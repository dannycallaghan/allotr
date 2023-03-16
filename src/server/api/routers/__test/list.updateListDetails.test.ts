import { test, expect } from '@jest/globals';
import { appRouter } from '../../root';
import { prisma } from '../../../db';
import type { UpdateListInput } from './testutils';
import { mockSession, mockListUpdateInput } from './testutils';
import type { List, PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

test('updateListDetails: Unauthenticated user should throw UNAUTHORIZED error', async () => {
  const caller = appRouter.createCaller({ session: null, prisma: prisma });

  try {
    await caller.list.updateListDetails(mockListUpdateInput);
  } catch (error) {
    expect(error).toHaveProperty('name', 'TRPCError');
    expect(error).toHaveProperty('code', 'UNAUTHORIZED');
  }
});

test('updateListDetails: Only list creator can update list details', async () => {
  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prisma,
  });

  try {
    await caller.list.updateListDetails(mockListUpdateInput);
  } catch (error) {
    expect(error).toHaveProperty('code', 'UNAUTHORIZED');
    expect(error).toHaveProperty(
      'message',
      'Only the list author can update the list.',
    );
  }
});

test('updateListDetails: List creator can update list details', async () => {
  const prismaMock = mockDeep<PrismaClient>();

  const input: UpdateListInput = {
    ...mockListUpdateInput,
    title: 'This is a new list title',
    authorId: mockSession?.user?.id as string,
  };

  const output: List = {
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  prismaMock.list.update.mockResolvedValue(output);

  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prismaMock,
  });

  const result = await caller.list.updateListDetails(input);

  expect(result).toStrictEqual(output);
});
