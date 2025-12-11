import { Router } from "express";
import { authCheck } from "../../middlewares/authCheck";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createBookingZodSchema,
  updateBookingZodSchema,
} from "./booking.validation";
import { bookingController } from "./booking.controller";

const router = Router();

router.post(
  "/create",
  authCheck(...Object.values(Role)),
  validateRequest(createBookingZodSchema),
  bookingController.createBooking
);

router.get(
  "/",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.getAllBookings
);
router.get(
  "/my-bookings",
  authCheck(...Object.values(Role)),
  bookingController.getMyBookings
);
router.get(
  "/:bookingId",
  authCheck(...Object.values(Role)),
  bookingController.getSingleBooking
);
router.patch(
  "/:bookingId",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateBookingZodSchema),
  bookingController.updateBooking
);

export const bookingRoutes = router;
