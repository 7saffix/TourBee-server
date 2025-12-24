import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { authCheck } from "../../middlewares/authCheck";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router();

router.post("/login", authController.credentialLogin);
router.post("/refresh-token", authController.getNewAccessToken);
router.post("/logout", authController.logOut);
router.post("/forget-password", authController.forgetPassword);
router.post(
  "/reset-password",
  authCheck(...Object.values(Role)),
  authController.resetPassword
);

router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.googleCallback
);

export const authRoutes = router;
