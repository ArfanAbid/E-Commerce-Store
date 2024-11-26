import User from "../models/user.models.js"
import Product from "../models/product.model.js"
import Order from "../models/order.model.js"

export const getAnalyticData=async ()=>{
    const totalUsers=await User.countDocuments();
    const totalProducts=await Product.countDocuments();

    const saleData=await Order.aggregate([
        {
            $group: {
                _id: null, // it groups all the documents together,rather than being grouped by a specific field.
                totalSales:{$sum:1}, // Basically it counts No of order in the order collection db
                totalRevenue:{$sum:"$totalAmount"}  // Sum up all the total amount stored in the order collection db
            }
        }
    ]);

    const {totalSales,totalRevenue}=saleData[0] || {totalSales:0,totalRevenue:0};
    return {
        users:totalUsers,
        products:totalProducts,
        totalSales,
        totalRevenue
    }


}




export const getDailySalesData=async (startDate,endDate)=>{
    try {
        const dailySalesData=await Order.aggregate([
            {
                $match: {
                    createdAt: { 
                        $gte: startDate,
                        $lte: endDate
                    }, // $gte means greater than or equal to and $lte means less than or equal to
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
                    sales: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" },
                },
            },
            {$sort:{_id:1}}, // sort the data by date in ascending order
        ]);
    /*
    output will be like this of getDailySalesData
    
    [
        {
            _id: "2023-01-01",
            sales: 5,
            revenue: 1000
        },
        {
            _id: "2023-01-02",
            sales: 3,
            revenue: 600
        },
    */
    
        const dateArray=getDareInRange(startDate,endDate);
        // console.log(dateArray);// ['2023-01-01', '2023-01-02', '2023-01-03', '2023-01-04', '2023-01-05', '2023-01-06', '2023-01-07']
		return dateArray.map((date) => {
			const foundData = dailySalesData.find((item) => item._id === date);

			return {
				date,
				sales: foundData?.sales || 0,
				revenue: foundData?.revenue || 0,
			};
		});
    } catch (error) {
        console.log("Error in get daily sales data",error.message);
        throw error
    }
}



function getDareInRange(startDate,endDate){
    const dates=[];

    let currentDate=new Date(startDate);
    while(currentDate<=endDate){
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate()+1);
    }

    return dates
}