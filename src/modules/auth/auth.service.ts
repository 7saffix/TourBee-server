/* eslint-disable @typescript-eslint/no-non-null-assertion */
import appError from "../../errorHelper/appError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import {
  createNewAccessTokeWithRefreshToken,
  createUserToken,
} from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new appError(httpStatus.BAD_REQUEST, "Email does not exist");
  }
  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );
  if (!isPasswordMatch) {
    throw new appError(httpStatus.BAD_REQUEST, "Password does not match");
  }

  const userToken = createUserToken(isUserExist);

  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: isUserExist,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newToken = await createNewAccessTokeWithRefreshToken(refreshToken);

  return {
    accessToken: newToken,
  };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user!.password as string
  );

  if (!isOldPasswordMatch) {
    throw new appError(httpStatus.UNAUTHORIZED, "old password does not match");
  }

  user!.password = await bcryptjs.hash(newPassword, 10);
  user!.save();
};

export const authService = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
};
