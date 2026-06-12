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
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { sendEmail } from "../../utils/sendEmail";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new appError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExist.password as string,
  );
  if (!isPasswordMatch) {
    throw new appError(httpStatus.BAD_REQUEST, "Password does not match");
  }

  const userToken = createUserToken(isUserExist);

  return {
    userToken,
    user: isUserExist,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newToken = await createNewAccessTokeWithRefreshToken(refreshToken);

  return {
    accessToken: newToken,
  };
};

const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new appError(404, "user doest not exist");
  }
  const JwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const resetToken = generateToken(JwtPayload, envVars.JWT_SECRET_KEY, "10m");

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset password",
    templateName: "forgetPassword",
    templateData: {
      name: user.name,
      resetUILink,
    },
  });
};

const resetPassword = async (id: string, newPassword: string) => {
  const user = await User.findById(id);

  if (!user) throw new appError(404, "user not found");

  const hashPassword = await bcryptjs.hash(newPassword, 10);

  user.password = hashPassword;
  await user.save();
};

export const authService = {
  credentialLogin,
  getNewAccessToken,
  forgetPassword,
  resetPassword,
};
