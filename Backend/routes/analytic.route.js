import express from "express";
import {protectedRoute} from "../middlewares/auth.middleware.js";
import { adminRoute } from "../middlewares/auth.middleware.js";

import {getAnalyticData,getDailySalesData} from "../controllers/analytic.controller.js";

const router = express.Router();

router.get("/",protectedRoute,adminRoute,async(req,res)=>{
    try {
        const analyticDta=await getAnalyticData();

        // Now working for Analytic Graph Data
        // Graph Analytic: Basically horizontall there will be a days and on that days there will be a number of sales and revenue. So we will have to make a graph which will show the sales and revenue on a daily basis.

        const endDate=new Date();
        const startDate=new Date(endDate.getTime()-7*24*60*60*1000); // 7 days
        const dailySakesData=await getDailySalesData(startDate,endDate);

        res.json({
            analyticDta,
            dailySakesData
        })
    } catch (error) {
        console.log("Error in get analytic data",error.message);
        res.status(500).json({ message: "Server error at get analytic data", error: error.message });
    }
});

export default router

