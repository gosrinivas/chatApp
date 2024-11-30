import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {

    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hassedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hassedPassword
        });


        if (newUser) {
            //generate JWT token here
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })

        }
        else {
            return res.status(400).json({ message: "Failed to create new user" });
        }


    } catch (error) {

        console.log("error in Signup Controller", error.message);
        res.status(501).json({ message: " internal Server error" });

    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email });

        if (!user) {
           return res.status(400).json({ message: "invalid Credentials" })
        }

        const iscorrect = await bcrypt.compare(password, user.password);

        if (!iscorrect) {
           return res.status(400).json({ message: "invalid Credentials" })
        }

        generateToken(user._id, res);


        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })




    } catch (error) {

        console.log("error in login Controller", error.message);
        res.status(501).json({ message: " internal Server error" });

    }
};

export const logout = (req, res) => {

    try {

        res.cookie("jwt","", {maxAge:0})
        res.status(200).json({ message: "logged out successfully" });
        


    } catch (error) {
        console.log("error in logOut Controller", error.message);
        res.status(501).json({ message: " internal Server error" });
        
    }
   
};

export const updateProfile=  async(req,res) =>{
    try {

        const {profilePic}=req.body;
        const userId=req.user._id;
        if(!profilePic){
            return res.status(400).json({message:"profilePic is required"})
        }

       const uploadResponse= await cloudinary.uploader.upload(profilePic);
       const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});

       res.status(200).json(updatedUser);



        
    } catch (error) {
        console.log("error in updateProfile pic",error);
        res.status(500).json({message:"internal server error"});
        
    }
}

export const checkAuth= async(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkAuth controller",error);
        res.status(500).json({message:"internal Server Error"});
        
    }

}
