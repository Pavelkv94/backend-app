import { Request, Response } from "express";
import { IdType, LoginInputModel, LoginOutputModel, MeViewModel } from "./models/auth.models";
import { authService } from "./auth.service";
import { usersService } from "../users/users.service";
import { usersQueryRepository } from "../users/users.query-repository";
import { OutputErrorsType } from "../../types/output-errors-types";

export const authController = {
  async login(req: Request<{}, {}, LoginInputModel>, res: Response<LoginOutputModel>) {
    const accessToken = await authService.checkCredentials(req.body);

    if (!accessToken) {
      res.sendStatus(401);
      return;
    }

    res.status(200).send({ accessToken });
  },
  async me(req: Request, res: Response<MeViewModel | OutputErrorsType>) {
    const user = await usersQueryRepository.findMe(req.user.id);

    if (!user) {
      res.status(500).json({ errorsMessages: [{ message: "Something was wrong", field: "" }] });
      return;
    }

    res.status(200).send(user);
  },
};
