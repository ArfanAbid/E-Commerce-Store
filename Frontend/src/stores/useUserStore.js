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

refreshToken: async () => {
    if(get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
        const res = await axios.get("/auth/refresh-token");
        set({checkingAuth: false });
        return res.data;
    } catch (error) {
        set({ checkingAuth: false, user: null });
        if (error.response?.status !== 401) {
            toast.error(error.message || "Something went wrong while checking auth");
        }
    }
},

}));


// Interceptors for refresh token

let refreshPromise=null;

axios.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // If refresh is already in progress, wait for it to complete
                if(refreshPromise){
                    await refreshPromise;
                    return axios(originalRequest);
                }
                // If refresh is not in progress, start a new one
                refreshPromise=useUserStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise=null;

                return axios(originalRequest);
            } catch (refreshError) {
                // If refresh token is expired or invalid, logout the user
                useUserStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);