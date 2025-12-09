/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "user created successful",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.getAllUsers(req.query);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "all users retrieved successfully",
      data: result.users,
      meta: result.meta,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    // const token = req.headers.authorization as string;
    // const decodedToken = verifyToken(
    //   token,
    //   envVars.JWT_SECRET_KEY
    // ) as JwtPayload;
    const decodedToken = req.user;

    const newUser = await userService.updateUser(
      userId,
      payload,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "user updated successfully",
      data: newUser,
    });
  }
);
export const userControllers = { createUser, getAllUsers, updateUser };
