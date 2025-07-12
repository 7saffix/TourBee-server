import { NextFunction, Request, Response } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const catchAsync =
  (fn: AsyncHandler) => (res: Request, req: Response, next: NextFunction) => {
    try {
      fn(res, req, next);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
