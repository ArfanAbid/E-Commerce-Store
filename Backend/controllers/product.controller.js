import redis from "../utils/redis.js";
import Product from "../models/product.model.js";
import cloudinary from "../utils/cloudinary.js";

// Note: This Conntroller is what another way you can write without asyncHandler function

const getAllProducts=async(req,res)=>{ // only admin should be able to access this route
    try {
        const products=await Product.find({});// empty object means get all products
        return res.status(200).json(products);
    } catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getFeaturedProducts=async(req,res)=>{ // customer + admin should be able to access this route
    try {
        let featuredProducts=await redis.get("featured_Products");
        if(featuredProducts){
            return res.status(200).json(JSON.parse(featuredProducts));
        }
        // if not in redis then fetch from db and store in redis
        featuredProducts=await Product.find({isFeatured:true}).lean();// lean() is gonna return a javascript object instead of mongoose doucument which is good for performance

        if(!featuredProducts){
            return res.status(404).json({ message: "No featured products found" });
        }
        // store in redis for future quick access in the format of string
        await redis.set("featured_Products",JSON.stringify(featuredProducts));

        return res.status(200).json(featuredProducts);
    } catch (error) {
        console.log("Error in get featured products",error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const createProduct=async(req,res)=>{
    try {
        const {name,description,price,image,category}=req.body;
        if(!name || !description || !price || !image || !category){
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        let cloudinaryResponse=null;
        if(image){
            cloudinaryResponse=await cloudinary.uploader.upload(image,{folder:"products"});
        }

        const product=await Product.create({
            name,
            description,
            price,
            image:cloudinaryResponse?.secure_url?cloudinaryResponse.secure_url:"",
            category
        });
        return res.status(201).json(product);
    } catch (error) {
        console.log("Error in create product",error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const deleteProduct=async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({ message: "Product not found" });
        }
        // Removing image from cloudinary
        if(product.image){
            const publicId=product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted from cloudinary");
            } catch (error) {
                console.log("Error in deleting image from cloudinary",error.message);
            }
        }
        // removing product from 
        await Product.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("Error in delete product",error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getRecommendedProduct=async(req,res)=>{
    try {
        const products=await Product.aggregate([
            {
                $sample:{size:3}
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    price:1,
                    image:1
                }
            }
        ])

        return res.status(200).json(products);
    } catch (error) {
        console.log("Error in get recommended product",error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getProductsByCategory=async(req,res)=>{
    const {category}=req.params;
    try {
        const products=await Product.find({category});
        return res.status(200).json(products);
    } catch (error) {
        console.log("Error in get products by category",error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const toggleFeaturedProduct=async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({ message: "Product not found" });
        }
        product.isFeatured=!product.isFeatured;
        const updatedProduct=await product.save();
        await updateFeaturedProductsCache(); // update in redis
        return res.status(200).json(updatedProduct);
    } catch (error) {
        
    }
}

async function updateFeaturedProductsCache(){
    try {
        const featuredProducts=await Product.find({isFeatured:true}).lean();
        await redis.set("featured_Products",JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("Error in update featured products cache",error.message);
    }
}


export  {
    getAllProducts,
    getFeaturedProducts,
    createProduct,
    deleteProduct,
    getRecommendedProduct,
    getProductsByCategory,
    toggleFeaturedProduct

}



