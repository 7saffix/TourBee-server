import { NextFunction, Request, Response } from "express";
import appError from "../errorHelper/appError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const authCheck =
  (...authRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new appError(403, "no token received");
      }
      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_SECRET_KEY
      ) as JwtPayload;

      if (!authRole.includes(verifiedToken.role)) {
        throw new appError(403, "you are not permitted to this route");
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
