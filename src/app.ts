import express, { Request, Response } from "express";
import { router } from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";

const app = express();
app.use(express.json());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to TourBee-A tour management system Backend");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
