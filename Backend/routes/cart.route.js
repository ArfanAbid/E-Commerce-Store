import express from "express";
import {getCartProducts,addToCart,removeAllFromCart,updateQuantity} from "../controllers/cart.controller.js";
import {protectedRoute,} from "../middlewares/auth.middleware.js";

const router=express.Router();

router.get("/",protectedRoute,getCartProducts); 
router.post("/",protectedRoute,addToCart); 
router.delete("/",protectedRoute,removeAllFromCart); // remove item and its quantity from cart
router.put("/:id",protectedRoute,updateQuantity); // update quantity of product increase or decrease

export default router;