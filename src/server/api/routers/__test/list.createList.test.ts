import { test, expect } from '@jest/globals';
import type { AppRouter } from '../../root';
import { appRouter } from '../../root';
import { prisma } from '../../../db';
import type { inferProcedureInput } from '@trpc/server';
import type { CreateListInput } from './testutils';
import {
  mockListOutput,
  mockListInput,
  mockSession,
  longText,
} from './testutils';
import type { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

test('createList: Unauthenticated user should throw UNAUTHORIZED error', async () => {
  const caller = appRouter.createCaller({ session: null, prisma: prisma });

  type Input = inferProcedureInput<AppRouter['list']['createList']>;

  const input: Input = {
    title: 'Test list',
    description: 'Test list description',
  };

  try {
    await caller.list.createList(input);
  } catch (error) {
    expect(error).toHaveProperty('code', 'UNAUTHORIZED');
  }
});

test('createList: Authenticated user can create list and have list ID returned', async () => {
  const prismaMock = mockDeep<PrismaClient>();

  prismaMock.list.create.mockResolvedValue(mockListOutput);

  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prismaMock,
  });

  const result = await caller.list.createList(mockListInput);

  expect(result).toStrictEqual(mockListOutput);
});

test('createList: List title must be 10 characters or more', async () => {
  const prismaMock = mockDeep<PrismaClient>();

  prismaMock.list.create.mockResolvedValue(mockListOutput);

  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prismaMock,
  });

  const input: CreateListInput = {
    title: 'Test list',
    description: 'Test list description',
  };

  try {
    await caller.list.createList(input);
  } catch (error) {
    expect(error).toHaveProperty('name', 'TRPCError');
    expect(error).toHaveProperty('code', 'BAD_REQUEST');
  }
});

test('createList: List title must be less than 256 characters', async () => {
  const prismaMock = mockDeep<PrismaClient>();

  prismaMock.list.create.mockResolvedValue(mockListOutput);

  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prismaMock,
  });

  const input: CreateListInput = {
    title: longText,
    description: '',
  };

  try {
    await caller.list.createList(input);
  } catch (error) {
    expect(error).toHaveProperty('name', 'TRPCError');
    expect(error).toHaveProperty('code', 'BAD_REQUEST');
  }
});

test('createList: List description must be less than 500 characters', async () => {
  const prismaMock = mockDeep<PrismaClient>();

  prismaMock.list.create.mockResolvedValue(mockListOutput);

  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prismaMock,
  });

  const input: CreateListInput = {
    title: 'This is a test list',
    description: longText,
  };

  try {
    await caller.list.createList(input);
  } catch (error) {
    expect(error).toHaveProperty('name', 'TRPCError');
    expect(error).toHaveProperty('code', 'BAD_REQUEST');
  }
});
