const express = require("express");
const app = express();
import { Request, Response } from "express";

app.get("/get", (req: Request, res: Response) => {
  const startTime = Date.now();
  res.json("get request");

  const endtime = Date.now();
  var timeTaken = endtime - startTime;
  console.log("request on /get took " + timeTaken + "ms");
});

app.post("/post", (req: Request, res: Response) => {
  res.json("post");
});

app.get("/cpu", (req: Request, res: Response) => {
  const startTIme = Date.now();

  for (let i = 0; i < 100000000; i++) {
    Math.random();
  }

  res.json({
    "return ": "cpu endpoint",
  });

  const endTime = Date.now();
  var timeTiaken = endTime - startTIme;

  console.log("request on /cpu took " + timeTiaken + "ms");
});

app.listen(3000);
