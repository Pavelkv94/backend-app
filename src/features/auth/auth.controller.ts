import { Request, Response } from "express";
import { IdType, LoginInputModel, MeViewModel } from "./models/auth.models";
import { authService } from "./auth.service";
import { usersService } from "../users/users.service";
import { usersQueryRepository } from "../users/users.query-repository";

export const authController = {
  async login(req: Request<{}, {}, LoginInputModel>, res: Response) {
    const accessToken = await authService.checkCredentials(req.body);

    if (!accessToken) {
      res.sendStatus(401);
      return;
    }

    res.status(200).send({ accessToken });
  },
  async me(req: Request<{}, {}, IdType>, res: Response<MeViewModel>) {
    const user = await usersQueryRepository.findMe(req.body.userId);

    if (!user) {
      res.sendStatus(404);
      return;
    }

    res.status(200).send(user);
  },
};
