import { envVars } from "../config/env";
import { IauthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.find({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      console.log("super admin already exist");
      return;
    }
    console.log("Trying to create Super Admin...");
    const hashPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, 10);
    const authProvider: IauthProvider = {
      provider: "credential",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "super admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      role: Role.SUPER_ADMIN,
      password: hashPassword,
      isVerified: true,
      auths: [authProvider],
    };

    const superAdmin = await User.create(payload);
    console.log("super admin created successfully", superAdmin);
  } catch (error) {
    console.log(error);
  }
};
