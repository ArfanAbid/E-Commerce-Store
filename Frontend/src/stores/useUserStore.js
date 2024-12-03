import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set,get) => ({
    user: null,
    loading:false,
    checkingAuth:true,

    signup: async({name,email,password,confirmPassword}) => {
        set({loading:true});
        if(password !== confirmPassword){
            set({loading:false});
            return toast.error("Passwords do not match");   
        }
        try {
            const res=await axios.post("/auth/register",{name,email,password});
            set({user:res.data,loading:false});
        } catch (error) {
            set({loading:false});
            console.log(error);
            toast.error(error.response?.data?.message|| "Something went wrong while signing up");
        }
    },

    login: async({email,password}) => {
        set({loading:true});
        try {
            const res=await axios.post("/auth/login",{email,password});
            set({user:res.data,loading:false});
        } catch (error) {
            set({loading:false});
            console.log(error.response.data.message);
            toast.error(error.response?.data?.message  || "Something went wrong while logging in");
        }
    },

    logout: async() => {
        try {
            await axios.post("/auth/logout");
            set({user:null});
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong while logging out");
        }
    },

    checkAuth: async () => {
    set({ checkingAuth: true });
    try {
        const res = await axios.get("/auth/profile");
        set({ user: res.data, checkingAuth: false });
    } catch (error) {
        set({ checkingAuth: false, user: null });
        if (error.response?.status !== 401) {
            toast.error(error.message || "Something went wrong while checking auth");
        }
    }
},

}));

// TODO: implement axios interceptors for refreshing access token

