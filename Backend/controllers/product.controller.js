import Product from "../models/product.model.js";

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
        
    } catch (error) {
        
    }
}
export  {
    getAllProducts,
    getFeaturedProducts,

}



