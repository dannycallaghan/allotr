/* eslint-disable @typescript-eslint/ban-ts-comment */
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  createListSchema,
  updateListDetailsSchema,
} from '../../../schemas/schemas';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const listRouter = createTRPCRouter({
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
        const result = await ctx.prisma.list.findUnique({
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
              orderBy: [
                {
                  updatedAt: 'desc',
                },
              ],
            },
          },
        });
        return result;
      } catch (error) {
        return error;
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
        return error;
      }
    }),

  // * Update an existing list details
  updateListDetails: protectedProcedure
    .input(updateListDetailsSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.authorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Only the list author can update the list.',
        });
      }

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
    .input(z.object({ id: z.string(), authorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.authorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Only the list author can delete the list.',
        });
      }

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

  // * Get all lists belonging to a single user
  getDashboardLists: protectedProcedure.query(async ({ ctx }) => {
    const authorId = ctx.session.user.id;
    try {
      const result = await ctx.prisma.list.findMany({
        where: {
          authorId,
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      });
      return result;
    } catch (error) {
      return error;
    }
  }),
});
