import { createTRPCRouter } from './trpc';
import { listRouter } from './routers/list';
import { taskRouter } from './routers/task';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  list: listRouter,
  task: taskRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
