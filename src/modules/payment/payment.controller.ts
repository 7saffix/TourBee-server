import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await paymentService.successPayment(query);

  if (result.success) {
    res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&message=${result.message}&status=${query.status}`,
    );
  }
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await paymentService.failPayment(query);
  console.log(result);

  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&success=${result.success}&message=${result.message}`,
    );
  }
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await paymentService.cancelPayment(
    query as Record<string, string>,
  );
  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&success=${result.success}&message=${result.message}`,
    );
  }
});

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;
  const booking = await paymentService.initPayment(bookingId);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "booking successfully created",
    data: booking,
  });
});

export const paymentController = {
  successPayment,
  cancelPayment,
  failPayment,
  initPayment,
};
