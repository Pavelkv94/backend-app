import { body } from "express-validator";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrors.middleware";

const contentValidator = body("likeStatus")
  .notEmpty()
  .withMessage("likeStatus is required")
  .isString()
  .withMessage("not string")
  .isIn(["None", "Like", "Dislike"])
  .withMessage("likeStatus must be one of: None, Like, Dislike");

export const likeBodyValidator = [contentValidator, inputCheckErrorsMiddleware];
