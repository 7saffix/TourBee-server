import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(3, { message: "Name must be minimum 3 character long" })
    .max(50, { message: "Name cannot be more than 50 Character" }),
  email: z
    .string({ invalid_type_error: "Email must be string" })
    .email({ message: "Invalid email format" }),
  password: z
    .string({ invalid_type_error: "password must be string" })
    .min(8, { message: "password must be at least 8 character long" })
    .regex(/^(?=.*[A-Z]).*$/, {
      message: "password must contain at least 1 uppercase",
    })
    .regex(/^(?=.*\d).*$/, {
      message: "password must contain at least 1 number",
    })
    .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
      message: "password must contain at least 1 special character",
    }),
  phone: z
    .string({ invalid_type_error: "Phone must be string" })
    .regex(/^01[3-9]\d{8}$/, {
      message: "phone number must be a valid bangladeshi number:01XXXXXXXXX",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(3, { message: "Name must be minimum 3 character long" })
    .max(50, { message: "Name cannot be more than 50 Character" })
    .optional(),
  email: z
    .string({ invalid_type_error: "Email must be string" })
    .email({ message: "Invalid email format" })
    .optional(),
  password: z
    .string({ invalid_type_error: "password must be string" })
    .min(8, { message: "password must be at least 8 character long" })
    .regex(/^(?=.*[A-Z]).*$/, {
      message: "password must contain at least 1 uppercase",
    })
    .regex(/^(?=.*\d).*$/, {
      message: "password must contain at least 1 number",
    })
    .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
      message: "password must contain at least 1 special character",
    })
    .optional(),
  phone: z
    .string({ invalid_type_error: "Phone must be string" })
    .regex(/^01[3-9]\d{8}$/, {
      message: "phone number must be a valid bangladeshi number:01XXXXXXXXX",
    })
    .optional(),
  isDeleted: z
    .boolean({ invalid_type_error: "isDeleted must be true or false" })
    .optional(),
  isVerified: z
    .boolean({ invalid_type_error: "isVerified must be true or false" })
    .optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .optional(),
});
