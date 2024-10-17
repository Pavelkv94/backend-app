import { body } from "express-validator";

export const commentBodyValidator = body("content")
  .notEmpty()
  .withMessage("content is required")
  .isString()
  .withMessage("not string")
  .isLength({ min: 20, max: 300 })
  .withMessage("invalid length");
