import { body } from "express-validator"

export const registerValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLowercase()
        .withMessage("Username should be in lowercase"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters long"),
   
]

export const loginValidator = [

    body("email")
        .optional()
        .isEmail()
        .withMessage("Email is invalid"),
    body("username")
        .optional()
        .isLowercase()
        .withMessage("Username should be in lowercase"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters long"),

]

export const changeCurrentPasswordValidator = [
    body("oldPassword")
        .notEmpty()
        .withMessage("Old password is required")
        .isLength({ min: 6 })
        .withMessage("Old password should be at least 6 characters long"),
    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 })
        .withMessage("New password should be at least 6 characters long"),
];