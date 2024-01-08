import { z } from "zod";

export const createEventSchema = z.object({
  title: z
    .string()
    .min(3, { message: "title cannot be less than 3" })
    .max(255, { message: "title cannot be more than 255" }),
  address: z
    .string()
    .min(3, { message: "address cannot be less than 3" })
    .max(255, { message: "address cannot be more than 255" }),
  description: z
    .string()
    .min(3, { message: "description cannot be less than 3" })
    .max(2040, { message: "description cannot be more than 255" }),
  date: z
    .date()
    .min(new Date(), { message: "date cannot be in the past" })
    .max(new Date(2100, 1, 1), { message: "date cannot be more than 2100" }),
});

export const updateEventSchema = z.object({
  ...createEventSchema.shape,
  id: z.string().cuid({ message: "id must be a cuid" }),
});

export const findEventByIdSchema = z.object({
  id: z.string().cuid({ message: "id must be a cuid" }),
});

export const addCommentToEventSchema = z.object({
  id: z.string().cuid({ message: "id must be a cuid" }),
  content: z
    .string()
    .min(3, { message: "comment cannot be less than 3" })
    .max(512, { message: "comment cannot be more than 512" }),
});

export const removeCommentOnEventSchema = z.object({
  id: z.string().cuid({ message: "id must be a cuid" }),
});

export const updateCommentEventSchema = z.object({
  id: z.string().cuid({ message: "id must be a cuid" }),
  content: addCommentToEventSchema.shape.content,
});
