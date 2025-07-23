import z from "zod";

export const createDivisionZodSchema = z.object({
  name: z.string({ invalid_type_error: "Name must be string" }),
  description: z
    .string({ invalid_type_error: "description must be string" })
    .optional(),
  thumbnail: z
    .string({ invalid_type_error: "description must be string" })
    .optional(),
});

export const updateDivisionZodSchema = z.object({
  name: z.string({ invalid_type_error: "Name must be string" }).optional(),
  description: z
    .string({ invalid_type_error: "Name must be string" })
    .optional(),
  thumbnail: z.string({ invalid_type_error: "Name must be string" }).optional(),
});
