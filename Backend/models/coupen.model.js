import mongoose from "mongoose";

const coupenSchema=new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true
    },

    discountPercentage:{
        type:Number,
        required:true,
        min:0,
        max:100,
    },

    expiryDate:{
        type:Date,
        required:true
    },

    isActive:{ // coupen code used or not 
        type:Boolean,
        default:true
    },

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
},

{timestamps:true}
);

const Coupen=mongoose.model("Coupen",coupenSchema);

export default Coupen
