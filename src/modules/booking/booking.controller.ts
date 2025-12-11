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

const getMyBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoded = req.user as JwtPayload;
    const bookings = await bookingService.getMyBookings(decoded.userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "booking retrieved successfully",
      data: bookings,
    });
  }
);

const getSingleBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoded = req.user as JwtPayload;
    const bookingId = req.params.bookingId;
    const booking = await bookingService.getSingleBooking(
      decoded.userId,
      bookingId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "booking retrieved",
      data: booking,
    });
  }
);

const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookings = await bookingService.getAllBookings();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All bookings successfully retrieved",
      data: bookings,
    });
  }
);

const updateBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.bookingId;
    const status = req.body.status;
    const booking = await bookingService.updateBooking(bookingId, status);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "booking updated successfully",
      data: booking,
    });
  }
);

export const bookingController = {
  createBooking,
  getMyBookings,
  getSingleBooking,
  getAllBookings,
  updateBooking,
};
