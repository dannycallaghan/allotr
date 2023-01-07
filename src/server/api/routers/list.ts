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
  getAllLists: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
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

  // * Create a task
  createTask: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.task.create({
          data: {
            title: input.title,
            isComplete: input.isComplete,
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
          },
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
        return await ctx.prisma.task.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            isComplete: input.isComplete,
          },
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
