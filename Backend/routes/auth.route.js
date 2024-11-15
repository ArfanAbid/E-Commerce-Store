import express from "express";
import {RegisterUser,LoginUser,LogoutUser,RefreshToken,getProfile} from "../controllers/auth.controller.js";
import {protectedRoute} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register",RegisterUser);
router.post("/login",LoginUser);
router.post("/logout",LogoutUser);
router.post("/refresh",RefreshToken);
router.get("/profile",protectedRoute,getProfile);



export default router