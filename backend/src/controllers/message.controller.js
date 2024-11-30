import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";


export const getUsersForSlider= async (req,res)=>{
    try {
        
        const logedInUserId=req.user._id;
        const filteredUsers= await User.find({_id:{$ne:logedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.log("error occured in getUserforslider controller", error);
        res.status(500).json({Message:"internal Server Error"});
    }
}

export const getMessages= async(req,res)=>{
    try {
        const {id:userToChatId}=req.params;
        const senderId=req.user._id;

        const messages=await Message.find({$or:[{senderId:senderId, receiverId:userToChatId},{senderId:userToChatId,receiverId:senderId}]})
        res.status(200).json(messages);
    } catch (error) {
        console.log("an error occured in getmessages controller", error.message);
        res.status(500).json({messages:"internal Server error"});
    }
}

export const sendMessage = async (req, res) => {
    try {
      const { text, image } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user._id;
  
      let imageUrl;
      if (image) {
        // Upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }
  
      const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
      });
  
      await newMessage.save();

      const receverSocketId= getReceiverSocketId(receiverId);

      if(receverSocketId){
        io.to(receverSocketId).emit("newMessage",newMessage);
      }
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

