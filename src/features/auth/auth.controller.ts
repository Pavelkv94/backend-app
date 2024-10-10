import { Request, Response } from "express";
import { LoginInputModel } from "../../input-output-types/auth-types";

export const authController = {
  async login(req: Request<{}, {}, LoginInputModel>, res: Response) {},
};
