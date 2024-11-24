import Coupon from "../models/coupon.model.js";
import {stripe} from "../utils/stripeConfig.js";
import Order from "../models/order.model.js";


// Create checkout session
export const createCheckoutSession=async(req,res)=>{
    try {
        const {products,couponCode}=req.body;

        if(!Array.isArray(products) || products.length===0){
            return res.status(400).json({ message: "Please provide valid products or empty products array" });
        }

        let totalAmount=0;
        const lineItems=products.map(product=>{
            const amount=Math.round(product.price*100); // stripe wants u to send in the format of cents
            totalAmount+=amount*product.quantity;

            return { // Format of lineItems for stripe
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity || 1,
            };
        });

        let coupon=null;
        if(couponCode){
            coupon=await Coupon.findOne({code:couponCode,userId:req.user._id,isActive:true});
            if(coupon){
                totalAmount -= Math.round(totalAmount*coupon.discountPercentage/100);
            }
        }


        // Creating session for stripe checkout
        const session=await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:lineItems,
            mode:"payment",
            success_url:`${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.CLIENT_URL}/purchase-cancel`,
            discounts:coupon?[{coupon:await createStripeCoupon(coupon.discountPercentage)}]:[],
            metadata:{
                userId:req.user._id.toString(),
                couponCode:couponCode||"",
                products:JSON.stringify(products.map(
                    product=>({
                        id:product.id,
                        quantity:product.quantity,
                        price:product.price
                    })
                )),
            },
        });

        // if the total amount is greater than 20000 then create a new coupon for the user for next time and save in the database
        if(totalAmount>20000){
            await createNewCoupon(req.user._id);
        }

        res.status(200).json({id:session,totalAmount:totalAmount / 100}); 

    } catch (error) {
        console.log("Error in create checkout session",error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


async function createStripeCoupon(discountPercentage){
    const stripeCoupon=await stripe.coupons.create({
        percent_off:discountPercentage,
        duration:"once",
    });
    return stripeCoupon.id;
}

async function  createNewCoupon(userId){
    const newCoupon=new Coupon({
        code:"GIFT"+Math.random().toString(36).substring(2,8).toUpperCase(),
        discountPercentage:10,
        expiryDate:new Date(Date.now()+30*24*60*60*1000), // 30 days
        userId:userId,
    })
    await newCoupon.save();
    return newCoupon;
}






// Controller for checkout success
export const checkoutSuccess=async(req,res)=>{
    try {
        const {session_id}=req.body;
        const session=await stripe.checkout.sessions.retrieve(session_id);
        
        if(session.payment_status==="paid"){
            if(session.metadata.couponCode){
                await Coupon.findOneAndUpdate({code:session.metadata.couponCode},{isActive:false}); // disable the coupon by setting isActive to false
            } 
        }

        // Creating a new Order
        const products=JSON.parse(session.metadata.products);
        const newOrder=new Order({
            user:session.metadata.userId,
            products:products.map(product=>({
                product: product.id,
                quantity: product.quantity,
                price: product.price
            })),
            totalAmount:session.amount_total / 100, // converting from cents to dollars
            stripeSessionId:session_id
        })

        await newOrder.save();
        res.status(200).json({
            message:"Payment SuccessFul,Order created successfully and coupon deactivated if any",
            success:true,
            orderId:newOrder._id
        })
    } catch (error) {
        console.log("Error in checkout success",error.message);
        res.status(500).json({ message: "Server error in checkout-success", error: error.message });
    }
}

