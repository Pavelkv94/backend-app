import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../../utils/jwt.service";
import { usersQueryRepository } from "../../users/users.query-repository";

export const authTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.sendStatus(401);
    return;
  }

  const [authType, token] = req.headers.authorization.split(" ");

  if (authType !== "Bearer") {
    res.sendStatus(401);
    return;
  }

  const payload = await jwtService.verifyToken(token);

  if (!payload) {
    res.sendStatus(401);
    return;
  }

  const user = await usersQueryRepository.findUser(payload.user_id);

  if (!user) {
    res.sendStatus(401);
    return;
  }

  req.body.userId = payload.user_id;

  next();
};
