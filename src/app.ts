import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to TourBee-A tour management system Backend");
});

export default app;
