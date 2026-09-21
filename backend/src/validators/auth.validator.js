import {body,validationResult} from "express-validator"

export const registerValidator = [
    body("email")
    .exists().withMessage("Email is required").bail()
    .trim()
    .isEmail().withMessage("Enter Valid email address"),

    body("name").exists().withMessage("Name is required").bail()
    .isString().withMessage("Name must be a string").bail()
    .trim()
    .isLength({min: 2, max: 50}).withMessage("Name must be between 2 and 50 characters long"),

    body("password")
    .exists().withMessage("password is required").bail()
    .isString().withMessage("Password must be a string").bail()
    .trim()
    .isLength({ min: 6 }).withMessage("Password must be minimum 6 character long"),
    
    (req, res, next) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Invalid Request",
                errors: errors.array()
            })
        }
        next()

    }
]

export const loginValidator = [
    body("email")
    .exists().withMessage("Email is required").bail()
    .isString().withMessage("Email must be a String").bail()
    .trim()
    .isEmail().withMessage("Enter Valid email address"),

    body("password")
    .exists().withMessage("password is required").bail()
    .isString().withMessage("Password must be a string").bail()
    .trim()
    .isLength({ min: 6 }).withMessage("Password must be minimum 6 character long"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Invalid data",
                errors: errors.array()
            });
        }
        next();
    }
]