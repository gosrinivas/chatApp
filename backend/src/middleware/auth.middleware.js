import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // Retrieve the JWT from cookies

        if (!token) {
            // If no token is provided
            return res.status(401).json({ message: "Unauthorized: No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            // If token is invalid
            return res.status(401).json({ message: "Unauthorized: Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            // If no user is found with the given token's userId
            return res.status(404).json({ message: "User Not Found" });
        }

        req.user = user; // Attach the user object to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error in protect route middleware:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
