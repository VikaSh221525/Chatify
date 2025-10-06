import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],

    activeTab: "chats",
    selectedUser: null,

    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === "true",

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
        set({isSoundEnabled: !get().isSoundEnabled});
    },

    seActiveTab: (tab) => set({activeTab: tab}),
    setSelectedUser: (user) => set({selectedUser: user}),

    getAllContacts: async() => {
        set({isUsersLoading: true});
        try {
            const response = await axiosInstance.get("/messages/contacts");
            set({allContacts: response.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isUsersLoading: false});
        }
    },

    getChatPartners: async() => {
        set({isUsersLoading: true});
        try {
            const response = await axiosInstance.get("/messages/chats");
            set({chats: response.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isUsersLoading: false});
        }
    }


}))
