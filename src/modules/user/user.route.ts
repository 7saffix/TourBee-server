import { Router } from "express";
import { userControllers } from "./user.controller";

import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { authCheck } from "../../middlewares/authCheck";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);
router.get(
  "/all-users",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  userControllers.getAllUsers
);
router.patch(
  "/update/:id",
  validateRequest(updateUserZodSchema),
  authCheck(...Object.values(Role)),
  userControllers.updateUser
);

export const userRoutes = router;
