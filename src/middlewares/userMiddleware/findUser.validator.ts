import { NextFunction, Request, Response } from "express";
import { usersRepository } from "../../repositories/users.repository";

export const findUserValidator = (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const isUserExist = usersRepository.find(req.params.id);
  if (!isUserExist) {
    res.sendStatus(404);
    return;
  }
  next();
};
