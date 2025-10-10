import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

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

    setActiveTab: (tab) => set({activeTab: tab}),
    setSelectedUser: (user) => set({selectedUser: user}),

    getAllContacts: async() => {
        set({isUsersLoading: true});
        try {
            const response = await axiosInstance.get("/messages/contacts");
            set({allContacts: response.data});
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
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
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({isUsersLoading: false});
        }
    },

    getMessagesByUserId: async (userId) => {
        set({isMessagesLoading: true});
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({messages: response.data});
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({isMessagesLoading: false});
        }
    },

    sendMessage: async(messageData)=>{
        const {selectedUser, messages} = get();
        const {authUser} = useAuthStore.getState();

        // Optimistic update really important
        const tempId = `temp-${Date.now()}`;
        const optimisticMessage = {
            _id: tempId,
            sender: authUser._id,
            receiver: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
        }
        set({messages: [...messages, optimisticMessage]});
        try {
            const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({messages: messages.concat(response.data)});
        } catch (error) {
            // remove optimistic message on failure
            set({messages: messages.filter((msg) => msg._id !== tempId)});
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    subscribeToMessages:()=>{
        const {selectedUser, isSoundEnabled} = get();
        if(!selectedUser){
            return;
        }
        const {socket} = useAuthStore.getState();
        if(!socket){
            return;
        }
        socket.emit("joinChat", selectedUser._id);
        socket.on("getMessage", (newMessage)=>{
            // imp
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(isMessageSentFromSelectedUser){
                return;
            }

            const {messages} = get();
            set({messages: [...messages, newMessage]});

            if(isSoundEnabled){
                new Audio("/notification.mp3").play().catch((e)=>console.log("Audio Play failed", e));
            }
        })
    },

    unsubscribeFromMessage: () =>{
        const {socket} = useAuthStore.getState();
        if(!socket){
            return;
        }
        socket.emit("leaveChat");
        socket.off("getMessage");
    }
}))
