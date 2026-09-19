import jwt from "jsonwebtoken"


export const createAccessToken = (userId,role)=>{
        const accessToken = jwt.sign({userId,role},config.ACCESS_TOKEN_SECRET,{expiresIn:"15Min"})
        return accessToken;
}
export const createRefreshToken = (userId,role)=>{
        const refreshToken = jwt.sign({userId,role},config.ACCESS_TOKEN_SECRET,{expiresIn:"7Days"})
        return refreshToken;
}