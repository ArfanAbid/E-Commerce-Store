import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    products:[ // order_Products is an array of objects
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
                min:1
            },
            price:{
                type:Number,
                required:true,
                min:0,
            },
        }
    ],
    totalAmount:{
        type:Number,
        required:true,
        min:0
    },
    StripeSessionId:{
        type:String,
        unique:true,
    },    
},

{timestamps:true}

);


const Order=mongoose.model("Order",orderSchema);

export default Order;