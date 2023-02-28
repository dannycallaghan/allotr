/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from 'zod';
import {
  createListSchema,
  createTaskSchema,
  updateListDetailsSchema,
  updateTaskSchema,
} from '../../../schemas/schemas';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const listRouter = createTRPCRouter({
  // * Get all lists - useful for testing
  getAllLists: protectedProcedure.query(async () => {
    try {
      return ctx.prisma.user.findMany();
    } catch (error) {
      console.log('Unable to find any lists');
      return null;
    }
  }),

  // * Get a single list by unique identifier
  getListById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      try {
        return await ctx.prisma.list.findUnique({
          where: {
            id,
          },
          include: {
            user: true,
            tasks: {
              include: {
                user: true,
                assignee: true,
              },
            },
          },
        });
      } catch (error) {
        console.log(`List not found: ${id}`);
        return null;
      }
    }),

  // * Create a new list
  createList: protectedProcedure
    .input(createListSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.list.create({
          data: {
            title: input.title,
            description: input.description,
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
      } catch (error) {
        console.log('Error', error);
      }
    }),

  // * Update an existing list details
  updateListDetails: protectedProcedure
    .input(updateListDetailsSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.list.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            description: input.description,
          },
        });
      } catch (error) {
        console.log('Error', error);
      }
    }),

  // * Delete a list
  deleteList: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.list.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log('Error', error);
      }
    }),

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
          },
        });
      } catch (error) {
        console.log(`Task not found: ${id}`);
        return null;
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

  // * Delete a task
  deleteTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        console.log('!!!!!!!!!!!!!!!');
        return await ctx.prisma.task.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log('Error', error);
      }
    }),
});
