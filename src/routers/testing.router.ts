import { Router } from "express";
import { clearDB } from "../db/db";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req, res) => {
  await clearDB();
  res.sendStatus(204);
});
