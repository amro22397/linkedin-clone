import User from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signup = async(req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const existingEmail = await User.findOne({ email })

        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingUsername = await User.findOne({ username })

        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            username
        })

        await user.save();

       const token = jwt.sign( { userId:user._id }, 'laddassdsakdsjjkssdsad', {expiresIn:"3d"});

        res.cookie("jwt-linkedin", token, {
            httpOnly:true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite:"strict",
            secure: process.env.NODE_ENV === "production",
        }); 
        res.status(201).json({ message: "User created successfully"})

    } catch (error) {
        console.log("Error signup: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const login = (req, res) => {
    res.send('login');
}

export const logout = (req, res) => {
    res.send('logout');
}