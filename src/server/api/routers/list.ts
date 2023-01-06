import { z } from 'zod';
import { createListSchema } from '../../../schemas/schemas';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

// export const exampleRouter = createTRPCRouter({
//   hello: publicProcedure
//     .input(z.object({ text: z.string() }))
//     .query(({ input }) => {
//       return {
//         greeting: `Hello ${input.text}`,
//       };
//     }),

//   getAll: publicProcedure.query(({ ctx }) => {
//     return ctx.prisma.example.findMany();
//   }),

//   getSecretMessage: protectedProcedure.query(() => {
//     return "you can now see this secret message!";
//   }),
// });

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
});
