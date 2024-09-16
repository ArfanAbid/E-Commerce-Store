import express from "express";
import {RegisterUser,LoginUser,LogoutUser,RefreshToken} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register",RegisterUser);
router.post("/login",LoginUser);
router.post("/logout",LogoutUser);
router.post("/refresh",RefreshToken);



export default router