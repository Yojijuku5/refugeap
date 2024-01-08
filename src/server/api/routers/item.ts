import {
  createImageSchema,
  findItemByIdSchema,
  removeItemSchema,
  updateItemSchema,
} from "../../../schemas/itemSchema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const itemRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createImageSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.item.create({
        data: { ...input, userId: ctx.session.user.id },
      });
    }),

  all: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.item.findMany({
      orderBy: { createdAt: "asc" },
      include: { user: true },
    });
  }),

  byId: publicProcedure
    .input(findItemByIdSchema)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.item.findUnique({
        where: { id: input.id },
        include: {
          user: {
            include: {
              items: {
                orderBy: { createdAt: "desc" },
                take: 3,
                where: { id: { not: input.id } },
              },
            },
          },
        },
      });
    }),

  remove: protectedProcedure
    .input(removeItemSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.item.delete({ where: { id: input.id } });
    }),

  update: protectedProcedure
    .input(updateItemSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.item.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
});
