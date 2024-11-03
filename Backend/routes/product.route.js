import express from "express"; 
import {protectedRoute} from "../middlewares/auth.middleware.js";
import {adminRoute} from "../middlewares/auth.middleware.js";
import {getAllProducts,getFeaturedProducts,createProduct,deleteProduct,getRecommendedProduct,getProductsByCategory,toggleFeaturedProduct} from "../controllers/product.controller.js";

const router = express.Router();

// Endpoints
router.get("/",protectedRoute,adminRoute,getAllProducts);
router.get("/featured",getFeaturedProducts);
router.get("/category/:category",getProductsByCategory);
router.get("/recommendation",getRecommendedProduct);
router.post("/createProduct",protectedRoute,adminRoute,createProduct);
router.patch("/:id",protectedRoute,adminRoute,toggleFeaturedProduct);
router.delete("/:id",protectedRoute,adminRoute,createProduct,deleteProduct);
export default router