import { useSession } from 'next-auth/react';
import { z } from 'zod';

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

const ICreateListInput = z.object({
  title: z
    .string()
    .min(10, { message: 'Must be 10 or more characters.' })
    .max(256, { message: 'Maximum length is 256 characters.' })
    .trim(),
  description: z
    .string()
    .min(10, { message: 'Must be 10 or more characters.' })
    .max(1024, { message: 'Maximum length is 1024 characters.' })
    .trim(),
});

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
    .input(ICreateListInput)
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
