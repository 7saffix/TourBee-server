import { Router } from "express";
import { authCheck } from "../../middlewares/authCheck";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema } from "./booking.validation";
import { bookingController } from "./booking.controller";

const router = Router();

router.post(
  "/create",
  authCheck(...Object.values(Role)),
  validateRequest(createBookingZodSchema),
  bookingController.createBooking
);

export const bookingRoutes = router;
