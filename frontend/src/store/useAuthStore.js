import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data});
        } catch (error) {
            console.log("Error in auth check: ", error);
            set({authUser:null})
        } finally {
            set({isCheckingAuth:false})
        }
    },

    signup: async(data) => {
        set({isSigningUp:true})
        try {
            const response = await axiosInstance.post("/auth/register", data);
            set({authUser: response.data})
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isSigningUp:false})
        }
    }


}))
