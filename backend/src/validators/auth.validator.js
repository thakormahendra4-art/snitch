import {body,validationResult} from "express-validator"

export const registerValidator = [
    body("email")
    .exists().withMessage("Email is required").bail()
    .trim()
    .isEmail().withMessage("Enter Valid email address"),
    body("name").exists().withMessage("Name is required").bail()
    .isString().withMessage("Name must be a string")
    .trim()
    .isLength({min: 2, max: 50}).withMessage("password  must be minimum 6 charactor long"),
    body("password")
    .exists().withMessage("password is required").bail()
    .isString().withMessage("Password must be a string")
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