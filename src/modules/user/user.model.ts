import { model, Schema } from "mongoose";
import { IauthProvider, isActive, IUser, Role } from "./user.interface";

const authSchema = new Schema<IauthProvider>(
  {
    provider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    address: { type: String },
    picture: { type: String },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(isActive),
      default: isActive.ACTIVE,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    auths: [authSchema],
  },
  { versionKey: false, timestamps: true }
);

export const User = model<IUser>("User", userSchema);
