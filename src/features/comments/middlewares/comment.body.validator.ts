import { body } from "express-validator";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrors.middleware";

const contentValidator = body("content")
  .notEmpty()
  .withMessage("content is required")
  .isString()
  .withMessage("not string")
  .isLength({ min: 20, max: 300 })
  .withMessage("invalid length");

export const commentBodyValidator = [contentValidator, inputCheckErrorsMiddleware];
