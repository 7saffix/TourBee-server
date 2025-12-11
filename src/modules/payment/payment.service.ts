/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import appError from "../../errorHelper/appError";
import { SSLService } from "../sslCommerz/sslCommerz.service";

const successPayment = async (query: Record<string, string>) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { runValidators: true, session }
    );
    await Booking.findOneAndUpdate(
      { _id: updatePayment?.booking },
      { status: BOOKING_STATUS.COMPLETED },
      { runValidators: true, session }
    );
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "payment successful",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { runValidators: true, session }
    );
    await Booking.findOneAndUpdate(
      { _id: updatedPayment?.booking },
      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "payment failed",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.CANCELED },
      { runValidators: true, session }
    );

    await Booking.findOneAndUpdate(
      { _id: updatedPayment?.booking },
      { status: BOOKING_STATUS.CANCEL },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "payment cancel",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) throw new appError(404, "payment not found");

  const booking = await Booking.findById(payment.booking);

  const sslPayload = {
    name: (booking?.user as any).name,
    email: (booking?.user as any).email,
    phone: (booking?.user as any).phone,
    address: (booking?.user as any).address,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

export const paymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};
