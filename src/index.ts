const express = require("express");
const app = express();
import { Request, Response } from "express";
import { middleware } from "./middleware/middleware";

// app.use(middleware);

app.get("/get", middleware, (req: Request, res: Response) => {
  res.json("get request");
});

app.post("/post", middleware, (req: Request, res: Response) => {
  res.json("post");
});

app.get("/cpu", middleware, (req: Request, res: Response) => {
  for (let i = 0; i < 100000000; i++) {
    Math.random();
  }

  res.json({
    "return ": "cpu endpoint",
  });
});

app.listen(3000);
