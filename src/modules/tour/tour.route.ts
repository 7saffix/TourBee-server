import { Router } from "express";
import { tourController } from "./tour.controller";
import { authCheck } from "../../middlewares/authCheck";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createTourTypeZodSchema,
  createTourZodSchema,
  updateTourZodSchema,
} from "./tour.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

// ---------Tour Type-------
router.post(
  "/create-tour-type",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  tourController.createTourType
);
router.get(
  "/tour-types",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.getAllTourType
);
router.patch(
  "/tour-type/:id",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  tourController.updateTourType
);
router.delete(
  "/tour-type/:id",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.deleteTourType
);

// ---------Tour---------
router.post(
  "/create",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(createTourZodSchema),
  tourController.createTour
);

router.get("/", tourController.getAllTours);
router.patch(
  "/:id",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(updateTourZodSchema),
  tourController.updateTour
);
router.delete(
  "/:id",
  authCheck(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.deleteTour
);
export const tourRoutes = router;
