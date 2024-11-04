import Coupen from "../models/coupen.model.js";

export const getCoupon=async (req,res)=>{
    try {
        const coupen=await Coupen.findOne({userId:req.user._id,isActive:true});
        res.json(coupen||null);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const validateCoupon=async (req,res)=>{
    try {
        const {code}=req.body;
        const coupen=await Coupen.findOne({code:code,userId:req.user._id,isActive:true});
        if(!coupen){
            return res.status(404).json({ message: "Coupen not found" });
        }

        if(coupen.expiryDate<Date.now()){
            coupen.isActive=false;
            await coupen.save();
            return res.status(404).json({ message: "Coupen expired" });
        }
        
        res.json({
            message:"Coupen is valid",
            code:coupen.code,
            discountPercentage:coupen.discountPercentage
        });
    } catch (error) { 
        console.log("Error in validate coupon",error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}