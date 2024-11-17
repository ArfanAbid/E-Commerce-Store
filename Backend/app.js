import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

// Setting
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
// app.use(express.json({limit:"16kb"})); // For parsing application/json
app.use(express.json({limit:"10mb"})); 
app.use(express.urlencoded({extended:true,limit:"16kb"})); // For parsing application/x-www-form-urlencoded
app.use(express.static("public")); // For serving static files
app.use(cookieParser());// For parsing cookies

// Routes
import authRoutes from "./routes/auth.route.js";
import productsRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytic.route.js";


// routes declaration
app.use("/api/auth",authRoutes);
app.use("/api/products",productsRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/coupons",couponRoutes);
app.use("/api/payments",paymentRoutes);
app.use("/api/analytics",analyticsRoutes);




export default app

