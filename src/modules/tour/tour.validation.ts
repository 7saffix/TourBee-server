import z from "zod";

export const createTourTypeZodSchema = z.object({
  name: z.string({ invalid_type_error: "name must be string" }),
});

export const createTourZodSchema = z.object({
  title: z.string({ invalid_type_error: "title must be string" }), // fixed typo in error message
  division: z.string({ invalid_type_error: "division must be string" }),
  tourType: z.string({ invalid_type_error: "tourType must be string" }),
  description: z
    .string({ invalid_type_error: "description must be string" })
    .optional(),
  location: z
    .string({ invalid_type_error: "location must be string" })
    .optional(),
  startDate: z
    .string({ invalid_type_error: "startDate must be string" })
    .optional(),
  endDate: z
    .string({ invalid_type_error: "endDate must be string" })
    .optional(),

  // --- Coerce strings to numbers here ---
  costForm: z.coerce
    .number({ invalid_type_error: "costForm must be number" })
    .optional(),
  maxGuest: z.coerce
    .number({ invalid_type_error: "maxGuest must be number" })
    .optional(),
  minAge: z.coerce
    .number({ invalid_type_error: "minAge must be number" })
    .optional(),

  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
});

export const updateTourZodSchema = z.object({
  title: z.string({ invalid_type_error: "title must be string" }).optional(), // fixed typo in error message
  division: z
    .string({ invalid_type_error: "division must be string" })
    .optional(),
  tourType: z
    .string({ invalid_type_error: "tourType must be string" })
    .optional(),
  description: z
    .string({ invalid_type_error: "description must be string" })
    .optional(),
  location: z
    .string({ invalid_type_error: "location must be string" })
    .optional(),
  startDate: z
    .string({ invalid_type_error: "startDate must be string" })
    .optional(),
  endDate: z
    .string({ invalid_type_error: "endDate must be string" })
    .optional(),

  // --- Coerce strings to numbers here ---
  costForm: z.coerce
    .number({ invalid_type_error: "costForm must be number" })
    .optional(),
  maxGuest: z.coerce
    .number({ invalid_type_error: "maxGuest must be number" })
    .optional(),
  minAge: z.coerce
    .number({ invalid_type_error: "minAge must be number" })
    .optional(),

  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  deletedImage: z.array(z.string()).optional(),
});
