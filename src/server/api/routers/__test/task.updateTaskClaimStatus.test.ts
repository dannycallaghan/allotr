import { test, expect } from '@jest/globals';
import { appRouter } from '../../root';
import { prisma } from '../../../db';
import {
  updateTaskClaimStatusInput,
  UpdateTaskClaimStatusInput,
} from './testutils';
import { mockSession, mockTaskUpdateInput } from './testutils';
import type { Task, PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

test('updateTaskClaimStatus: Unauthenticated user should throw UNAUTHORIZED error', async () => {
  const caller = appRouter.createCaller({ session: null, prisma: prisma });

  try {
    await caller.task.updateTaskClaimStatus(mockTaskUpdateInput);
  } catch (error) {
    expect(error).toHaveProperty('name', 'TRPCError');
    expect(error).toHaveProperty('code', 'UNAUTHORIZED');
  }
});

test('updateTaskClaimStatus: Authenticated user can can claim task', async () => {
  const prismaMock = mockDeep<PrismaClient>();
  const input: UpdateTaskClaimStatusInput = {
    authorId: mockSession?.user?.id as string,
    claimed: true,
    assigneeId: mockSession?.user?.id as string,
    id: '123',
  };
  const output: Task = {
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
    isComplete: false,
    claimed: true,
    priority: 0,
    assigneeId: mockSession?.user?.id as string,
    title: '',
    listId: '',
    dueDate: null,
    description: null,
    comment: null,
    attachments: null,
    suggestedAssignee: null,
  };
  prismaMock.task.update.mockResolvedValue(output);
  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prismaMock,
  });
  const result = await caller.task.updateTaskClaimStatus(input);
  expect(result).toStrictEqual(output);
});

test('updateTaskClaimStatus: Only task assignee and task creator can unclaim task', async () => {
  const prismaMock = mockDeep<PrismaClient>();
  const input: UpdateTaskClaimStatusInput = {
    authorId: '456',
    claimed: false,
    assigneeId: '789',
    id: '123',
  };

  const caller = appRouter.createCaller({
    session: mockSession,
    prisma: prismaMock,
  });

  try {
    await caller.task.updateTaskClaimStatus(input);
  } catch (error) {
    expect(error).toHaveProperty('name', 'TRPCError');
    expect(error).toHaveProperty('code', 'UNAUTHORIZED');
  }
});
