import { Request, Response } from "express";
import { LoginInputModel } from "../../input-output-types/auth-types";
import { authService } from "./auth.service";

export const authController = {
  async login(req: Request<{}, {}, LoginInputModel>, res: Response) {
    const isSuccessLogin = await authService.checkCredentials(req.body);

    if (!isSuccessLogin) {
      res.sendStatus(401);
      return;
    }

    res.sendStatus(204);
  },
};
