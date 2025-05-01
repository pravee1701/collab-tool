import { body, param } from "express-validator";

export const projectValidator = [
  body("name").notEmpty().withMessage("Project name is required"),
  body("description").optional().isString().withMessage("Description must be a string"),
];

export const projectUpdateValidator = [
  body("name").optional().isString().withMessage("Project name must be a string"),
  body("description").optional().isString().withMessage("Description must be a string"),
];

export const collaboratorValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
];

