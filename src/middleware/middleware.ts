import { Response, Request, NextFunction } from "express";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  next();

  const endTIme = Date.now();
  var timeTake = endTIme - startTime;

  console.log("request took " + timeTake + "ms");
}
