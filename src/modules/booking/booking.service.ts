/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
// import appError from "../../errorHelper/appError";

import { IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import mongoose from "mongoose";
import { SSLService } from "../sslCommerz/sslCommerz.service";

const createTransactionId = () => {
  return `transaction_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

const createBooking = async (payload: IBooking, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.create([{ ...payload, user: userId }], {
      session,
    });

    const tour = await Tour.findById(booking[0].tour)
      .select("costForm")
      .session(session);

    const tourCost = Number(tour?.costForm) * Number(booking[0].guestCount);

    const transactionId = createTransactionId();
    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          amount: tourCost,
          transactionId,
        },
      ],
      { session },
    );

    const updateBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      {
        payment: payment[0]._id,
      },
      { new: true, runValidators: true, session },
    )
      .populate("user", "name email phone")
      .populate("tour", "title location costForm")
      .populate("payment", "amount transactionId status");

    const sslPayload = {
      name: (updateBooking?.user as any).name,
      email: (updateBooking?.user as any).email,
      amount: tourCost,
      transactionId: transactionId,
      phone: (updateBooking?.user as any).phone,
      address: (updateBooking?.user as any).address,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    await session.commitTransaction();
    session.endSession();

    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updateBooking,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getMyBookings = async (userId: string) => {
  const bookings = await Booking.find({
    user: userId,
    status: "COMPLETED",
  }).populate("tour", "title location costForm");
  return bookings;
};

const getSingleBooking = async (userId: string, bookingId: string) => {
  const bookingDetails = await Booking.findOne({
    _id: bookingId,
    user: userId,
  }).populate("payment");
  return bookingDetails;
};

const getAllBookings = async () => {
  const bookings = await Booking.find({});
  return bookings;
};

const updateBooking = async (bookingId: string, status: Partial<IBooking>) => {
  const bookings = await Booking.findOneAndUpdate(
    { _id: bookingId },
    { status },
    {
      new: true,
      runValidators: true,
    },
  );
  return bookings;
};

export const bookingService = {
  createBooking,
  getMyBookings,
  getSingleBooking,
  getAllBookings,
  updateBooking,
};
