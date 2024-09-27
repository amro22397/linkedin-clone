import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'


export const protectRoute = async(req, res, next) => {
    
    try {
        const token = req.cookies["jwt-linkedin"];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No provided" });
    }

    const decoded = jwt.verify(token, 'laddassdsakdsjjkssdsad');

    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized - Invalid"})
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
        return res.status(401).json({ message: "User not found"})
    }

    req.user = user;

    next();
    } catch (error) {
        console.log("Error in potect route", error.message);
        res.status(500).json({ message: "Internal server error"})
    }
}