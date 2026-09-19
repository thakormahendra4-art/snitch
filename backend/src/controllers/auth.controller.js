import bcrypt from "bcryptjs"
import userModel from "../models/user.model.js"


export const register =async (req,res)=>{
    const {email,name,passwors} = req.body

    const isUserAlreadyExists = await userModel.findOne({
        email
    })

    if(!isUserAlreadyExists){
        return res.status(400).json({
            message: "User already exists with this email address",
            errors: [
                {
                    field: "email",
                    message: "User already exists with this email address"
                }
            ]
        })
    }

    const user = await userModel.create({
        email,
        name,
        passwordHash: await bcrypt.hash(password, 12)
    })

    const accessToken = createAccessToken({
        userId: user._id,
        role: user.role
    })
    const refreshToken = createRefreshToken({
        userId: user._id,
        role: user.role
    })
}