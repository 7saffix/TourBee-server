/* eslint-disable @typescript-eslint/no-explicit-any */
import appError from "../../errorHelper/appError";
import { IauthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new appError(httpStatus.BAD_REQUEST, "Email already exist");
  }
  const hashPassword = await bcryptjs.hash(password as string, 10);

  const authProvider: IauthProvider = {
    provider: "credential",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const getAllUsers = async (queryOptions: any) => {
  const { search, isActive, role, sortBy, page, limit } = queryOptions;

  const query: any = {};

  //filter
  if (role) query.role = role;
  if (isActive) query.isActive = isActive;

  //search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } },
    ];
  }

  //sort
  let sortOptions: any = {};
  switch (sortBy) {
    case "A-Z":
      sortOptions = { email: 1 };
      break;
    case "Z-A":
      sortOptions = { email: -1 };
      break;
    default:
      sortOptions = { createdAt: -1 };
  }

  //pagination
  const skip = Number(page - 1) * limit;
  const totalUser = await User.countDocuments(query);

  const users = await User.find(query)
    // .collation({ locale: "en", strength: 2 }) when using name but if there any upper case in name
    .skip(skip)
    .limit(limit)
    .sort(sortOptions);
  return {
    users,
    meta: {
      page,
      limit,
      total: totalUser,
    },
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new appError(httpStatus.NOT_FOUND, "user not found");
  }

  if (payload.role) {
    if (decodedToken.role == Role.USER || decodedToken.role == Role.GUIDE) {
      throw new appError(httpStatus.FORBIDDEN, "you cannot update your role");
    }
    if (payload.role == Role.SUPER_ADMIN && decodedToken.role == Role.ADMIN) {
      throw new appError(
        httpStatus.FORBIDDEN,
        "you are not permitted to update the role super admin",
      );
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role == Role.USER || decodedToken.role == Role.GUIDE) {
      throw new appError(httpStatus.FORBIDDEN, `you are Not permitted`);
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(payload.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return { updatedUser };
};

const getMe = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new appError(404, "user not found");

  return user;
};

export const userService = { createUser, getAllUsers, updateUser, getMe };
