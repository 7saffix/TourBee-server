import { redisClient } from "../../config/redis.config";
import appError from "../../errorHelper/appError";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";
import crypto from "crypto";

const otpExpire = 2 * 60;

const generateOTP = (length = 6) => {
  //   const otp = crypto.randomInt(100000,1000000);
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString(); //for dynamic
  return otp;
};

const sendOTP = async (email: string, name: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new appError(404, "Email does not exist");

  const otp = generateOTP();

  const redisKey = `otp:${email}`;
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: otpExpire,
    },
  });

  await sendEmail({
    to: email,
    subject: "OTP verification",
    templateName: "otp",
    templateData: {
      name,
      otp,
    },
  });
};
const verifyOTP = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  if (!user) throw new appError(404, "not found");
  if (user.isVerified) throw new appError(400, "You already verified");

  const redisKey = `otp:${email}`;
  const savedOtp = await redisClient.get(redisKey);

  if (!savedOtp) throw new appError(400, "invalid otp");

  if (savedOtp !== otp) throw new appError(400, "invalid otp");

  await Promise.all([
    User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { runValidators: true }
    ),
    redisClient.del([redisKey]),
  ]);
};

export const otpService = { sendOTP, verifyOTP };
