import express, { Request, Response } from "express";
import { router } from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import "./config/passport";
import { envVars } from "./config/env";
import passport from "passport";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to TourBee-A tour management system Backend");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
