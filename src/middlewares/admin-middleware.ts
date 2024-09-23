import { Response, Request, NextFunction } from "express";
import { SETTINGS } from "../settings";

export const fromBase64ToUTF8 = (code: string) => {
  const buff = Buffer.from(code, "base64");
  const decodedAuth = buff.toString("utf8");
  return decodedAuth;
};
export const fromUTF8ToBase64 = (code: string) => {
  const buff2 = Buffer.from(code, "utf8");
  const codedAuth = buff2.toString("base64");
  return codedAuth;
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers["authorization"] as string; // 'Basic xxxx'

  if (!auth) {
    res.sendStatus(401);
    return;
  }
  if (auth.slice(0, 6) !== "Basic ") {
    res.sendStatus(401);
    return;
  }

  const decodedAuth = fromBase64ToUTF8(auth.slice(6));
  const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN);

  if (decodedAuth !== SETTINGS.ADMIN) {
    res.sendStatus(401);
    return;
  }

  next();
};
