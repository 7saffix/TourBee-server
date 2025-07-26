import z from "zod";

export const createBookingZodSchema = z.object({
  tour: z.string(),
  guestCount: z.number().int().positive(),
});
