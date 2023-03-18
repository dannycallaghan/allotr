/* eslint-disable @typescript-eslint/ban-ts-comment */
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskClaimStatusSchema,
} from '../../../schemas/schemas';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const taskRouter = createTRPCRouter({
  // * Get a single task by unique identifier
  getTaskById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      try {
        return await ctx.prisma.task.findUnique({
          where: {
            id,
          },
          include: {
            user: true,
            assignee: true,
            list: true,
          },
        });
      } catch (error) {
        return error;
      }
    }),

  // * Create a task
  createTask: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = {
          title: input.title,
          isComplete: input.isComplete,
          dueDate: input.dueDate,
          description: input.description,
          comment: input.comment,
          attachments: input.attachments,
          suggestedAssignee: input.suggestedAssignee,
          claimed: input.claimed,
          priority: input.priority,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          list: {
            connect: {
              id: input.listId,
            },
          },
        };
        if (data.claimed) {
          // @ts-ignore
          data.assignee = {
            connect: {
              id: ctx.session.user.id,
            },
          };
        }
        return await ctx.prisma.task.create({
          data,
        });
      } catch (error) {
        console.log('Error', error);
      }
    }),

  // * Update a task
  updateTask: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.claimed && input.assigneeId) {
        // if the task is not claimed by the user and the user isn't the author
        if (
          input.assigneeId !== ctx.session.user.id &&
          input.authorId !== ctx.session.user.id
        ) {
          const message =
            'Only the task creator or task assignee can update the task.';
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message,
          });
        }
      }

      try {
        const data = {
          title: input.title,
          isComplete: input.isComplete,
          dueDate: input.dueDate,
          description: input.description,
          comment: input.comment,
          attachments: input.attachments,
          suggestedAssignee: input.suggestedAssignee,
          claimed: input.claimed,
          priority: input.priority,
          list: {
            connect: {
              id: input.listId,
            },
          },
        };
        if (data.claimed) {
          // @ts-ignore
          data.assignee = {
            connect: {
              id: ctx.session.user.id,
            },
          };
        }
        return await ctx.prisma.task.update({
          where: {
            id: input.id,
          },
          data,
        });
      } catch (error) {
        console.log('Error', error);
      }
    }),

  // * Update a task's claim status
  updateTaskClaimStatus: protectedProcedure
    .input(updateTaskClaimStatusSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.claimed) {
        // Only creator and assignee can unclaim a task
        if (
          input.assigneeId !== ctx.session.user.id &&
          input.authorId !== ctx.session.user.id
        ) {
          const message =
            'Only the task creator or task assignee can update the task.';
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message,
          });
        }
      }

      try {
        const data = {
          claimed: input.claimed,
        };
        if (data.claimed) {
          // @ts-ignore
          data.assignee = {
            connect: {
              id: ctx.session.user.id,
            },
          };
        }
        return await ctx.prisma.task.update({
          where: {
            id: input.id,
          },
          data,
        });
      } catch (error) {
        console.log('Error', error);
      }
    }),

  // * Delete a task
  deleteTask: protectedProcedure
    .input(z.object({ id: z.string(), authorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.authorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Only the task author can delete the task.',
        });
      }

      try {
        return await ctx.prisma.task.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log('Error', error);
      }
    }),

  // * Get all tasks claimed by a user
  getDashboardTasks: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    try {
      const result = await ctx.prisma.task.findMany({
        where: {
          claimed: true,
          assigneeId: userId,
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      });
      if (result) {
        return result;
      }
      const msg = `No tasks found for: ${userId}`;
      console.log(msg);
      return msg;
    } catch (error) {
      const msg = `Error attempting to get tasks belonging to ${userId}`;
      console.log(msg);
      return msg;
    }
  }),
});
