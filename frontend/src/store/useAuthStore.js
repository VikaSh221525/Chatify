import { create } from "zustand";
import { toast } from "react-hot-toast";
import {axiosInstance} from "../lib/axios";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/api";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data });
            // Connect socket after successful auth check
            get().connectSocket();
        } catch (error) {
            console.log("Error in auth check: ", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async(data) => {
        set({isSigningUp:true})
        try {
            const response = await axiosInstance.post("/auth/register", data);
            set({authUser: response.data})
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isSigningUp:false})
        }
    },

    login: async(data) => {
        set({isLoggingIn:true})
        try {
            const response = await axiosInstance.post("/auth/login", data);
            set({authUser: response.data});
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isLoggingIn:false})
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error("Error in logout");
        }
    },

    updateProfile: async (data) => {
        try {
            const response = await axiosInstance.patch("/auth/update-profile", data);
            set({authUser: response.data})
            toast.success("Profile updated successfully");
        } catch (error) {
            throw error; // Re-throw to let toast.promise handle the error
        }
    },  

    connectSocket: () => {
        const { authUser } = get();
        
        if (!authUser) {
            console.log("No auth user found");
            return;
        }

        // Disconnect existing socket if any
        if (get().socket) {
            get().socket.disconnect();
        }

        const socket = io(BASE_URL, {
            withCredentials: true,
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        // Set up event listeners before connecting
        socket.on("connect", () => {
            console.log("Socket connected");
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        socket.on("getOnlineUsers", (onlineUserIds) => {
            set({ onlineUsers: onlineUserIds });
        });

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        set({ socket });
    },
    disconnectSocket: ()=>{
        if(get().socket?.connected){
            get().socket.disconnect();
        }
        set({socket: null, onlineUsers: []})
    }


}))
