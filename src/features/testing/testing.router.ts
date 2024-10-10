import { Router } from "express";
import { db } from "../../db/db";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req, res) => {
  db.drop();
  res.sendStatus(204);
});
