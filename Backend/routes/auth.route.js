import express from "express";
import RegisterUser from "../controllers/auth.controller.js";

const router = express.Router();


router.post("/register",RegisterUser.registerUser);


export default router