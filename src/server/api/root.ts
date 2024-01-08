import { createTRPCRouter } from "./trpc";
import { mediaRouter } from "./routers/media";
import { itemRouter } from "./routers/item";
import { eventRouter } from "./routers/event";
import { blogRouter } from "./routers/blog";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  media: mediaRouter,
  item: itemRouter,
  event: eventRouter,
  blog: blogRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
