import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  JWT_EXPIRES_IN: string;
  JWT_SECRET_KEY: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
}

const loadEnvVariable = (): EnvConfig => {
  const requiredEnvVars: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "JWT_SECRET_KEY",
    "JWT_EXPIRES_IN",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
  ];
  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing Environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development",
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
  };
};

export const envVars: EnvConfig = loadEnvVariable();
