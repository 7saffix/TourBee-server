/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { divisionService } from "./division.service";

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const division = await divisionService.createDivision(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "division created successfully",
      data: division,
    });
  }
);

const getAllDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const divisions = await divisionService.getAllDivision();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "divisions retrieved successfully",
      data: divisions,
    });
  }
);
const updateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedData = await divisionService.updateDivision(
      req.params.id,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "division updated successfully",
      data: updatedData,
    });
  }
);
const deleteDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await divisionService.deleteDivision(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "division deleted successfully",
      data: null,
    });
  }
);

export const divisionController = {
  createDivision,
  getAllDivision,
  updateDivision,
  deleteDivision,
};
