import { z } from "zod";

export const createImageSchema = z.object({
  title: z
    .string()
    .min(3, { message: "title cannot be less than 3" })
    .max(255, { message: "title cannot be more than 255" }),
  location: z
    .string()
    .min(3, { message: "location cannot be less than 3" })
    .max(255, { message: "location cannot be more than 255" }),
  description: z
    .string()
    .min(3, { message: "description cannot be less than 3" })
    .max(2040, { message: "description cannot be more than 255" }),
  images: z
    .string()
    .url({ message: "images must be in url type" })
    .array()
    .max(5, { message: "maximum of 5 images is allowed" })
    .min(1, { message: "minimum of 1 image is required" }),
});

export const removeItemSchema = z.object({
  id: z.string().cuid({ message: "id must be a cuid" }),
});

export const findItemByIdSchema = z.object({
  id: z.string().cuid({ message: "id must be a cuid" }),
});

export const updateItemSchema = z.object({
  id: z.string().cuid({ message: "id must be a cuid" }),
  ...createImageSchema.shape,
});
