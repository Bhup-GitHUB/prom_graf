const express = require("express");
const app = express();
import { Request, Response, NextFunction } from "express";
// import { middleware } from "./middleware/middleware";
import promCleint from "prom-client";

// function middleware(req: Request, res: Response, next: NextFunction) {
//   const startTime = Date.now();
//   next();

//   const endTIme = Date.now();
//   var timeTake = endTIme - startTime;

//   console.log("request took " + timeTake + "ms", "on route " + req.url);
// }

const requestGauge = new promCleint.Gauge({
  name: "active_requests",
  help: "Number of active requests",
});
const requestCounter = new promCleint.Counter({
  name: "htt_request_counter",
  help: "Number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const requestHistogram = new promCleint.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
});

function requestCountMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Increment request gauge
  if (req.route.path !== "/metric") {
    requestGauge.inc();
  }
  const startTime = Date.now();

  res.on("finish", () => {
    const endTime = Date.now();
    console.log(`Request took ${endTime - startTime}ms`);

    // Increment request counter
    requestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode,
    });
    //decrease request gauge
    if (req.route.path !== "/metric") {
      requestGauge.dec();
    }
    //updating historgram
    requestHistogram.observe(endTime - startTime);
  });
  next();
}

// app.use(middleware);

app.get("/cpu", requestCountMiddleware, (req: Request, res: Response) => {
  for (let i = 0; i < 1200; i++) {
    Math.random();
  }

  res.json({
    "return ": "cpu endpoint",
  });
});

app.get("/get", requestCountMiddleware, (req: Request, res: Response) => {
  res.json({
    "return ": "get endpoint",
  });
});
app.get("/metrics", async (req: Request, res: Response) => {
  const metrics = await promCleint.register.metrics();
  console.log(promCleint.register.contentType);
  res.set("Content-Type", promCleint.register.contentType); ///text hoga most probably
  res.end(metrics);
});

app.listen(3000);
