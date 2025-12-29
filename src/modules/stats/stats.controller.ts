/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { statService } from "./stats.service";
const getUserStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statService.getUserStats();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user stats retrieved successfully",
      data: result,
    });
  }
);
const getTourStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statService.getTourStats();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "tour stats retrieved successfully",
      data: result,
    });
  }
);
const getBookingStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const booking = await statService.getBookingStats();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "booking stats retrieved successfully",
      data: booking,
    });
  }
);
const getPaymentStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payments = await statService.getPaymentStats();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "payment stats retrieved successfully",
      data: payments,
    });
  }
);

export const statController = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats,
};
