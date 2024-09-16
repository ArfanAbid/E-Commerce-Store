import User from "../models/user.models";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import redis from "../utils/redis.js";

const generateTokens=(userId)=>{
    const accessToken=jwt.sign(
        {
            userId
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:"15m"
        }
    );

    const refreshToken=jwt.sign(
        {
            userId
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:"7d"
        }
    );

    return {accessToken,refreshToken};
}
const storeRefreshToken=async(userId,refreshToken)=>{
    await redis.set(`refreshToken:${userId}`,refreshToken,"EX",7*24*60*60);// 7 days
}
const setCookies=(res,accessToken,refreshToken)=>{
    res.cookie("accessToken",accessToken,{
        httpOnly:true, // prevent XSS attack
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",// prevent CSRF attack
        maxAge:15*60*1000, // 15 minutes
    
    });

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true, // prevent XSS attack
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",// prevent CSRF attack
        maxAge:7*24*60*60*1000, // 7 days

    });

}

const registerUser=asyncHandler(async(req,res,next)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        throw new ApiError(400,"Please provide name, email and password");
    }
    const userExists=await User.findOne({email});
    if(userExists){
        throw new ApiError(409,"User already exists");
    }
    const user=await User.create({
        name,
        email,
        password,
    });

    // authenticate user
    const {accessToken,refreshToken}=generateTokens(user._id);
    
    await storeRefreshToken(user._id,refreshToken);

    setCookies(res,accessToken,refreshToken);

    const createdUser=User.findById(user._id).select("-password");
    if(!createdUser){
        throw new ApiError(404,"User not found");
    }

    return res.status(201).json(new ApiResponse(201,createdUser,"User created successfully"));
});

const LogoutUser=asyncHandler(async(req,res,next)=>{
    try {
        const refresh=req.cookies.refreshToken;
        if(refresh){
            const decoded=jwt.verify(refresh,process.env.REFRESH_TOKEN_SECRET);
            if(decoded){
                const userId=decoded.userId;
                await redis.del(`refreshToken:${userId}`);
            }
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res.status(200).json(new ApiResponse(200,"User logged out successfully"));
        }
    } catch (error) {
        throw new ApiError(401,error.message);
    }

})

export default {
    registerUser,
}