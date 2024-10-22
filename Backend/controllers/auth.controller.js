import User from "../models/user.models.js";
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

// API controller for Register User

const RegisterUser=asyncHandler(async(req,res,next)=>{
    try {
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
    
        const createdUser=await User.findById(user._id).select("-password");
        if(!createdUser){
            throw new ApiError(404,"User not found");
        }
    
        return res.status(201).json(new ApiResponse(201,createdUser,"User created successfully"));
    } catch (error) {
        console.log("Error in register user",error.message);
        throw new ApiError(500,error.message);
    }
});

// API controller for Login User

const LoginUser=asyncHandler(async(req,res,next)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            throw new ApiError(400,"Please provide email and password");
        }

        const user=await User.findOne({email});
        if(user && (await user.comparePassword(password))){
            const {accessToken,refreshToken}=generateTokens(user._id);
            await storeRefreshToken(user._id,refreshToken);
            setCookies(res,accessToken,refreshToken);

            return res.status(200).json(new ApiResponse(200,{_id:user._id,name:user.name,email:user.email},"User logged in successfully"));

        }else{
            throw new ApiError(401,"Invalid email or password");
        }
    } catch (error) {
        console.log("Error in login user",error.message);
        throw new ApiError(500,error.message);
    }
});

// API controller for Logout User

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
        console.log("Error in logout user",error.message);
        throw new ApiError(401,error.message);
    }

})

// API controller to refresh the access token

const RefreshToken=asyncHandler(async(req,res,next)=>{
    const refresh=req.cookies.refreshToken;
    if(!refresh){
        throw new ApiError(401,"Unauthorized request");
    }
    const decoded=jwt.verify(refresh,process.env.REFRESH_TOKEN_SECRET);
    if(!decoded){
        throw new ApiError(401,"Please login to get access");
    }
    const storedRefreshToken=await redis.get(`refreshToken:${decoded.userId}`);
    if(storedRefreshToken!==refresh){
        throw new ApiError(401,"RefreshToken is expired or invalid");
    }
    const accessToken=jwt.sign({userId:decoded.userId},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"15m",
    });

    res.cookie("accessToken",accessToken,{
        httpOnly:true, // prevent XSS attack
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",// prevent CSRF attack
        maxAge:15*60*1000, // 15 minutes

    });
    return res.status(200).json(new ApiResponse(200,"Access token refreshed successfully"));
});

export {
    RegisterUser,
    LoginUser,
    LogoutUser,
    RefreshToken,

}