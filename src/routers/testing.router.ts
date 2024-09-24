import { Router } from "express";
import { blogCollection, clearDB, postCollection } from "../db/db";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req, res) => {
  await clearDB();

  res.status(204).json({});
});
