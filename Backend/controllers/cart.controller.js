import Product from "../models/product.model.js";

export const getCartProducts=async(req,res)=>{
    try {
        const products=await Product.find({_id:{$in:req.user.cartItems}});

        // add quantity for each product in cart because product model doesn't have quantity
        const cartProducts=products.map(product=>{
            const item=req.user.cartItems.find(cartItem=>cartItem.id===product.id);
            return {
                ...product.toJSON(),
                quantity:item.quantity
            }
        })

        res.json(cartProducts);
    } catch (error) {
        console.log("Error in get cart products",error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const addToCart=async(req,res)=>{
    try {
        const {productId}=req.body;
        const user=req.user;
        // check if product is already in cart then add one in it else push it in cart new entery
        const existingItem=user.cartItems.find(item=>item.id===productId);
        if(existingItem){
            existingItem.quantity+=1;
        }else{
            user.cartItems.push({productId,quantity:1});
        }
        await user.save();
        res.json(user.cartItems);

    } catch (error) {
        console.log("Error in add to cart",error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const removeAllFromCart=async(req,res)=>{
    try {
        const {productId}=req.body;
        const user=req.user;
        if(!productId){
            user.cartItems=[];
        }else{
            user.cartItems=user.cartItems.filter(item=>item.id!==productId);
        }
        await user.save();
        res.json(user.cartItems);
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const updateQuantity=async(req,res)=>{
    try {
        const {id:productId}=req.params;
        const {quantity}=req.body;
        const user=req.user;
        const existingItem=user.cartItems.find(item=>item.id===productId);

        if(existingItem){
            if(quantity===0){// this is the case when we want to remove product from cart with quantity 0 i.e when quantity is 1 and we decrement it to 0 so it should be removed from cart
                user.cartItems=user.cartItems.filter(item=>item.id!==productId);
                await user.save();
                res.json(user.cartItems);
            }
            existingItem.quantity=quantity;
            await user.save();
            res.json(user.cartItems);
        }else{
            res.status(404).json({ message: "Product not found in cart" });   
        }
    } catch (error) {
        console.log("Error in update quantity",error.message); 
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

