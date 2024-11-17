import express from "express"; 
import {protectedRoute} from "../middlewares/auth.middleware.js";
import {adminRoute} from "../middlewares/auth.middleware.js";
import {getAllProducts,getFeaturedProducts,createProduct,deleteProduct,getRecommendedProduct,getProductsByCategory,toggleFeaturedProduct} from "../controllers/product.controller.js";

const router = express.Router();

// Endpoints
router.get("/getAllProducts",protectedRoute,adminRoute,getAllProducts);
router.get("/featured",getFeaturedProducts);
router.get("/category/:category",getProductsByCategory);
router.get("/recommendation",getRecommendedProduct);
router.post("/createProduct",protectedRoute,adminRoute,createProduct);
router.patch("/toggle-Featured-Product/:id",protectedRoute,adminRoute,toggleFeaturedProduct);
router.delete("/deleteProduct/:id",protectedRoute,adminRoute,deleteProduct);
export default router