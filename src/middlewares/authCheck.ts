import { NextFunction, Request, Response } from "express";
import appError from "../errorHelper/appError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import { IsActive } from "../modules/user/user.interface";

export const authCheck =
  (...authRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken || req.headers.authorization;

      if (!accessToken) {
        throw new appError(403, "no token received");
      }
      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_SECRET_KEY
      ) as JwtPayload;

      const isUserExist = await User.findOne({
        email: verifiedToken.email,
      });

      if (!isUserExist) {
        throw new appError(httpStatus.BAD_REQUEST, "user does not exist");
      }

      if (
        isUserExist.isActive == IsActive.BLOCKED ||
        isUserExist.isActive == IsActive.INACTIVE
      ) {
        throw new appError(
          httpStatus.BAD_REQUEST,
          `user is ${isUserExist.isActive}`
        );
      }

      if (isUserExist.isDeleted) {
        throw new appError(httpStatus.BAD_REQUEST, "user is deleted");
      }

      if (!authRole.includes(verifiedToken.role)) {
        throw new appError(403, "you are not permitted to this route");
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
