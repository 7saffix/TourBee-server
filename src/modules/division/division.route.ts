import { Router } from "express";
import { divisionController } from "./division.controller";
import { authCheck } from "../../middlewares/authCheck";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/create",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(createDivisionZodSchema),
  divisionController.createDivision,
);

router.get(
  "/",

  divisionController.getAllDivision,
);

router.patch(
  "/:id",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(updateDivisionZodSchema),
  divisionController.updateDivision,
);
router.delete(
  "/:id",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.deleteDivision,
);

export const divisionRoutes = router;
