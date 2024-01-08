import {
  addCommentToEventSchema,
  createEventSchema,
  findEventByIdSchema,
  removeCommentOnEventSchema,
  updateCommentEventSchema,
  updateEventSchema,
} from "../../../schemas/eventSchema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createEventSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.event.create({
        data: { ...input, userId: ctx.session.user.id },
      });
    }),

  all: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.event.findMany({
      orderBy: { date: "asc" },
    });
  }),

  byId: publicProcedure
    .input(findEventByIdSchema)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.event.findUnique({
        where: { id: input.id },
        include: {
          comments: {
            include: { user: true },
            orderBy: { createdAt: "asc" },
          },
        },
      });
    }),

  addComment: protectedProcedure
    .input(addCommentToEventSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.eventComment.create({
        data: {
          content: input.content,
          eventId: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),
  removeComment: protectedProcedure
    .input(removeCommentOnEventSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.eventComment.delete({
        where: { id: input.id },
      });
    }),

  updateComment: protectedProcedure
    .input(updateCommentEventSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.eventComment.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),

  update: protectedProcedure
    .input(updateEventSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.event.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),

  remove: protectedProcedure
    .input(findEventByIdSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.event.delete({
        where: { id: input.id },
      });
    }),
});
