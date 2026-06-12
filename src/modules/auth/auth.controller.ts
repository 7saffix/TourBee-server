/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { setCookies } from "../../utils/setCookies";
import appError from "../../errorHelper/appError";
import { createUserToken } from "../../utils/userToken";
import { envVars } from "../../config/env";
import passport from "passport";

// const credentialLogin = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // const logInfo = await authService.credentialLogin(req.body);

//     passport.authenticate("local", async (error: any, user: any, info: any) => {
//       if (error) {
//         return next(error);
//       }

//       if (!user) {
//         return next(new appError(401, info.message));
//       }

//       const userToken = await createUserToken(user);

//       setCookies(res, userToken);

//       sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "LoggedIn successful",
//         data: {
//           user,
//           userToken,
//         },
//       });
//     })(req, res, next);
//   }
// );

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const logInfo = await authService.credentialLogin(req.body);

    setCookies(res, logInfo.userToken);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "LoggedIn successful",
      data: {
        user: logInfo.user,
        userToken: logInfo.userToken,
      },
    });
  },
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const tokenInfo = await authService.getNewAccessToken(
      refreshToken as string,
    );

    setCookies(res, tokenInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "refresh token created",
      data: tokenInfo,
    });
  },
);

const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "log out successful",
      data: null,
    });
  },
);

const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await authService.forgetPassword(email);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Email send successfully",
      data: null,
    });
  },
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, newPassword } = req.body;
    // const decodedToken = req.user as JwtPayload;

    await authService.resetPassword(id, newPassword);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "password changes successfully",
      data: null,
    });
  },
);

const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirect = req.query.state ? (req.query.state as string) : "";

    if (redirect.startsWith("/")) {
      redirect = redirect.slice(1);
    }
    const user = req.user;
    console.log(user);

    if (!user) {
      throw new appError(httpStatus.NOT_FOUND, "User Not Found");
    }

    const tokenInfo = createUserToken(user);

    setCookies(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirect}`);
  },
);

export const authController = {
  credentialLogin,
  getNewAccessToken,
  logOut,
  forgetPassword,
  resetPassword,
  googleCallback,
};
