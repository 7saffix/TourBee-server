import appError from "../../errorHelper/appError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

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

  const accessToken = generateToken(
    {
      userId: isUserExist._id,
      email: isUserExist.email,
      role: isUserExist.role,
    },
    envVars.JWT_SECRET_KEY,
    envVars.JWT_EXPIRES_IN
  );

  return {
    accessToken,
    user: isUserExist,
  };
};

export const authService = { credentialLogin };
