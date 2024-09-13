import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/dbConnection.js";

dotenv.config();

const PORT= process.env.PORT || 8000;

connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`⚙️  Server is running on http://localhost:${PORT}`);
    }) 
})
.catch((error)=>{
    console.log(`MongoDB Connection Error: ${error}`)
});

