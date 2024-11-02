import express from "express"; 
import {protectedRoute} from "../middlewares/auth.middleware.js";
import {adminRoute} from "../middlewares/auth.middleware.js";
import {getAllProducts,getFeaturedProducts} from "../controllers/product.controller.js";

const router = express.Router();

// Endpoints
router.get("/",protectedRoute,adminRoute,getAllProducts);
router.get("/featured",getFeaturedProducts);

export default router