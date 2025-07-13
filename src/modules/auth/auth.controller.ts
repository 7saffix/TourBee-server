/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const logInfo = await authService.credentialLogin(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "LoggedIn successful",
      data: logInfo,
    });
  }
);

export const authController = { credentialLogin };
