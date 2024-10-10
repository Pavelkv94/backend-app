import { body } from "express-validator";
import { db } from "../../../db/db";

type UniqueField = {
  login?: string;
  email?: string;
};

const isUserUniqueField = async (field: UniqueField) => {
  const existingUser = await db.getDbName().collection("users").findOne(field);
  return !existingUser;
};

const userLoginInputValidator = body("login")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage("should be from 3 to 10 symbols")
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage("Login must contain only letters, numbers, underscores, and hyphens")
  .custom(async (login) => {
    const isUnique = await isUserUniqueField({ login });
    if (!isUnique) {
      throw new Error("Login must be unique");
    }
    return true;
  });

const userPasswordInputValidator = body("password")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("should be from 6 to 20 symbols");

const userEmailInputValidator = body("email")
  .isString()
  .withMessage("not string")
  .trim()
  .isEmail()
  .withMessage("Invalid email")
  .custom(async (email) => {
    const isUnique = await isUserUniqueField({ email });
    if (!isUnique) {
      throw new Error("Email must be unique");
    }
    return true;
  });

export const userBodyValidators = [userLoginInputValidator, userPasswordInputValidator, userEmailInputValidator];
