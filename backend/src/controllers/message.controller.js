import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import messageModel from "../models/message.model.js"
import userModel from "../models/User.model.js"

export const getAllContacts = async(req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await userModel.find({
            _id: { $ne: loggedInUserId }
        }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in get AllContacts :", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const {id : partnerId} = req.params;

        const messages = await messageModel.find({
            $or: [
                {senderId: myId, receiverId: partnerId},
                {senderId: partnerId, receiverId: myId}
            ]
        }).sort({createdAt: 1});

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in get MessagesByUserId :", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {id : receiverId} = req.params;
        const {text, image} = req.body;
        const senderId = req.user._id;

        if(!text && !image){
            return res.status(400).json({
                message: "Text or Image is required",
            })
        }
        if(senderId.equals(receiverId)){
            return res.status(400).json({
                message: "cannot send message to yourself",
            })
        }

        const receiverUser = await userModel.exists({ _id: receiverId });
        if(!receiverUser){
            return res.status(404).json({
                message: "Receiver not found",
            })
        }

        let imageUrl;
        if(image){
            // upload 64base image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image, {
                upload_preset: "chatify",
            })
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await messageModel({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        await newMessage.save();
        // todo send message in real time if user is online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("getMessage", newMessage);
        }
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in send Message :", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        // find all the messages where loggedInUserId is either senderId or receiverId
        const messages = await messageModel.find({
            $or: [
                {senderId: loggedInUserId},
                {receiverId: loggedInUserId}
            ]
        }).sort({createdAt: 1});

        const chatPartnersId = [...new Set(messages.map((msg) => msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString()))];
        const chatPartners = await userModel.find({ _id: { $in: chatPartnersId } }).select("-password");
        res.status(200).json(chatPartners);
    } catch (error) {
        console.log("Error in get ChatPartners :", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}