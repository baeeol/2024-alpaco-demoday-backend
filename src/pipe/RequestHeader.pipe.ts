import { Router, Request, Response } from "express";

const RequestHeaderPipe = Router();

RequestHeaderPipe.use(GetAccessTokenData);

function GetAccessTokenData(req: Request, res: Response, next: Function) {
  const requestUserId = req.headers["access-token"];
  if (req.body) {
    req.body = { ...req.body, userId: requestUserId };
  } else {
    req.body = { userId: requestUserId };
  }
  next();
}

export default RequestHeaderPipe;
