import {
  addCommentToBlogSchema,
  createBlogSchema,
  findBlogByIdSchema,
  removeBlogSchema,
  updateBlogSchema,
  updateCommentBlogSchema,
  deleteCommentFromBlogSchema,
} from "../../../schemas/blogSchema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const blogRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createBlogSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.blog.create({
        data: { ...input, userId: ctx.session.user.id },
      });
    }),

  all: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.blog.findMany({
      orderBy: { createdAt: "asc" },
      include: { user: true },
    });
  }),

  byId: publicProcedure
    .input(findBlogByIdSchema)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.blog.findUnique({
        where: { id: input.id },
        include: {
          user: true,
          comments: {
            include: { user: true },
            orderBy: { createdAt: "asc" },
          },
        },
      });
    }),

  addComment: protectedProcedure
    .input(addCommentToBlogSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.blogComment.create({
        data: {
          content: input.content,
          blogId: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  deleteComment: protectedProcedure
    .input(deleteCommentFromBlogSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.blogComment.delete({
        where: { id: input.id },
      });
    }),

  updateComment: protectedProcedure
    .input(updateCommentBlogSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.blogComment.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),

  remove: protectedProcedure
    .input(removeBlogSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.blog.delete({
        where: { id: input.id },
      });
    }),

  update: protectedProcedure
    .input(updateBlogSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.blog.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
});
