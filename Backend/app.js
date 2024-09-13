import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

// Setting
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"})); // For parsing application/json
app.use(express.urlencoded({extended:true,limit:"16kb"})); // For parsing application/x-www-form-urlencoded
app.use(express.static("public")); // For serving static files
app.use(cookieParser());// For parsing cookies

// Routes
import authRoutes from "./routes/auth.route.js";


// routes declaration
app.use("/api/auth",authRoutes);




export default app

