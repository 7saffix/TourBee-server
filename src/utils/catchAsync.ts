import { NextFunction, Request, Response } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const catchAsync =
  (fn: AsyncHandler) =>
  async (res: Request, req: Response, next: NextFunction) => {
    try {
      await fn(res, req, next);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
