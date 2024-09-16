import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minlength:[6,"Password must be at lest 6 characters"],

    },
    role:{
        type:String,
        enum:["admin","customer"],// enum is a validator used in schema definitions to ensure that a particular field can only accept values from a predefined set
        default:"customer",
    },
    cartItem:[
        {
            quantity:{
                type:Number,
                default:1,
            },
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product", 
            },
        },
    ],

},
{
    timestamps:true
}
);


// pre-save hook for hashing password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    try{
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
        next();
    }
    catch(error){
        next(error);
    }
    
})

// creating a custom method for password verification used in login
userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}


const User=mongoose.model("User",userSchema); 

export default User;