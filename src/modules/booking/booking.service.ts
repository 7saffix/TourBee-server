/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import appError from "../../errorHelper/appError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";

const getTransactionId = () => {
  return `trans_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId);

    if (!user?.phone || !user.address) {
      throw new appError(
        httpStatus.BAD_REQUEST,
        "please update your profile first"
      );
    }

    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    const transactionId = getTransactionId();

    const tour = await Tour.findById(payload.tour).select("costForm");

    if (!tour?.costForm) {
      throw new appError(httpStatus.BAD_REQUEST, "No Tour Cost Found!");
    }

    const amount = Number(tour?.costForm) * Number(payload.guestCount);

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          transactionId: transactionId,
          status: PAYMENT_STATUS.UNPAID,
          amount: amount,
        },
      ],
      { session }
    );

    const updateBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costForm")
      .populate("payment");

    const userName = (updateBooking?.user as any).name;
    const userEmail = (updateBooking?.user as any).email;
    const userAddress = (updateBooking?.user as any).address;
    const userPhone = (updateBooking?.user as any).phone;

    const sslPayload: ISSLCommerz = {
      transactionId: transactionId,
      amount: amount,
      name: userName,
      email: userEmail,
      address: userAddress,
      phone: userPhone,
    };
    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    await session.commitTransaction();
    session.endSession();

    return {
      payment: sslPayment.GatewayPageURL,
      booking: updateBooking,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const bookingService = { createBooking };
