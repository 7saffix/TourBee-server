import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/env";
import { seedSuperAdmin } from "./utils/seedSuperAdmin";
// import { connectRedis } from "./config/redis.config";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Database connected successful✔");
    server = app.listen(envVars.PORT, () => {
      console.log(`server connected at port ${envVars.PORT}💻`);
    });
  } catch (error) {
    console.log("MongoDB connection failed!", error);
  }
};

(async () => {
  // await connectRedis();
  await startServer();
  await seedSuperAdmin();
})();

process.on("unhandledRejection", (error) => {
  console.log("unhandled rejection detected...server shutting down!", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.log("uncaught exception detected...server shutting down!", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received...server shutting down!");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
