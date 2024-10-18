import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exeptions/api-error";

export const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    err.send(res); // Handle known ApiError
  } else {
    // Fallback for unknown errors
    res.status(500).json({ message: "An unknown error occurred." });
  }
};
