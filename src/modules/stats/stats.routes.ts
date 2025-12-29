import { Router } from "express";
import { authCheck } from "../../middlewares/authCheck";
import { Role } from "../user/user.interface";
import { statController } from "./stats.controller";

const router = Router();

router.get(
  "/users",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  statController.getUserStats
);
router.get(
  "/tours",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  statController.getTourStats
);
router.get(
  "/bookings",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  statController.getBookingStats
);
router.get(
  "/payments",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  statController.getPaymentStats
);

export const statsRoutes = router;
