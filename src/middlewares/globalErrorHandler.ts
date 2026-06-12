/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import appError from "../errorHelper/appError";
import { deleteFromCloudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = `${error.message}`;

  if (req.file) {
    await deleteFromCloudinary(req.file?.path);
  }
  if (req.files && Array.isArray(req.files) && req.files.length) {
    const imageUrl = (req.files as Express.Multer.File[]).map(
      (file) => file.path,
    );
    await Promise.all(imageUrl.map((url) => deleteFromCloudinary(url)));
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    statusCode = 409;
    message = `${field} already exist`;
  } else if (error.name === "ValidationError") {
    const errorMessages = Object.values(error.errors).map(
      (err: any) => err.message,
    );

    statusCode = 400;
    message = errorMessages[0];
  } else if (error.name === "ZodError") {
    const errorMessages = error.issues.map(
      (err: any) => err.path + " " + err.message,
    );
    statusCode = 400;
    message = errorMessages[0];
  } else if (error instanceof appError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    error,
    stack: process.env.NODE_ENV === "development" ? error?.stack : null,
  });
};
