import { Types } from "mongoose";

export enum BOOKING_STATUS {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCEL = "CANCEL",
  FAILED = "FAILED",
}

export interface IBooking {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  guestCount: number;
  payment?: Types.ObjectId;
  status: BOOKING_STATUS;
  createdAt?: Date;
}
