import { Response } from "express";

export function handleUnexpectedError(res: Response, error: Error) {
  console.error(error);
  res.status(500).json({ message: `An unexpected error occurred. Reason: ${error.message || "unknown"}` });
}
