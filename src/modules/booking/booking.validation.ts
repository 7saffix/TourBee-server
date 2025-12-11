import z from "zod";

export const createBookingZodSchema = z.object({
  tour: z.string(),
  guestCount: z.number().int().positive(),
});
export const updateBookingZodSchema = z.object({
  status: z.string(),
});
