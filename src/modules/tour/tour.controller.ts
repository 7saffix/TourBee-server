/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { tourService } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { ITourQueryOptions } from "./tour.interface";

//---------- Tour Type----------
const createTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await tourService.createTourType(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "tour type created successfully",
      data: tourType,
    });
  }
);

const getAllTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourTypes = await tourService.getAllTourType();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "tour types retrieved successfully",
      data: tourTypes,
    });
  }
);

const updateTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await tourService.updateTourType(req.params.id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "tour type updated successfully",
      data: tourType,
    });
  }
);

const deleteTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await tourService.deleteTourType(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "tour type deleted successfully",
      data: null,
    });
  }
);

//---------- Tour ----------
const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await tourService.createTour(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "tour created successfully",
      data: tour,
    });
  }
);

const getAllTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await tourService.getAllTour(req.query as any);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "tour types retrieved successfully",
      meta: result.meta,
      data: result.tours,
    });
  }
);

const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await tourService.updateTour(req.params.id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "tour updated successfully",
      data: tour,
    });
  }
);

const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await tourService.deleteTour(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "tour deleted successfully",
      data: null,
    });
  }
);

export const tourController = {
  createTourType,
  getAllTourType,
  updateTourType,
  deleteTourType,
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
};
