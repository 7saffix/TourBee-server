/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { bookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoded = req.user as JwtPayload;
    const booking = await bookingService.createBooking(
      req.body,
      decoded.userId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "booking successfully created",
      data: booking,
    });
  }
);

export const bookingController = { createBooking };
