import { z } from "zod";

export const createBlogSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(255, { message: "Title must be at most 255 characters long" }),
  content: z
    .string()
    .min(3, { message: "Content must be at least 3 characters long" })
    .max(2040, { message: "Content must be at most 255 characters long" }),
});

export const findBlogByIdSchema = z.object({
  id: z.string().cuid({ message: "id must be a cuid" }),
});

export const addCommentToBlogSchema = z.object({
  id: z.string().cuid({ message: "id must be a cuid" }),
  content: z
    .string()
    .min(3, { message: "comment cannot be less than 3" })
    .max(512, { message: "comment cannot be more than 512" }),
});

export const removeBlogSchema = z.object({
  id: z.string().cuid({ message: "id must be a cuid" }),
});

export const deleteCommentFromBlogSchema = z.object({
  id: z.string().cuid({ message: "id must be a cuid" }),
});

export const updateBlogSchema = z.object({
  ...createBlogSchema.shape,
  id: z.string().cuid({ message: "id must be a cuid" }),
});

export const updateCommentBlogSchema = z.object({
  id: z.string().cuid({ message: "id must be a cuid" }),
  content: addCommentToBlogSchema.shape.content,
});
