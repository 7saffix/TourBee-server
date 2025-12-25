/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { otpService } from "./otp.service";

const sendOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name } = req.body;
    await otpService.sendOTP(email, name);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OTP send successfully",
      data: null,
    });
  }
);

const verifyOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    await otpService.verifyOTP(email, otp);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OTP verified successfully",
      data: null,
    });
  }
);

export const otpController = { sendOTP, verifyOTP };
