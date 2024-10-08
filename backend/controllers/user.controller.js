import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js";


export const getSearchUsers = async (req, res) => {
    
    try {
        const searchTerm = req.query.searchTerm || '';
        console.log(searchTerm)

        const users = await User.find({
            
            username: { $regex: searchTerm, $options: 'i' }

        }).sort({ createdAt: -1 })

        return res.status(200).json(users);
    } catch (error) {
        res.status(200).json('Error in getting users', error)
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } }).sort({ createdAt: -1 })
        .select("name username profilePicture headline")

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json("Error getting users", error)
    }
}
export const getSuggestedConnections = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select("connections")

        const suggestedUser = await User.find({
            _id: {
                $ne: req.user._id,
                $nin: currentUser.connections,
            },
        })
        .select("name username profilePicture headline")
        .limit(3)
        .sort({ createdAt: -1})

        res.json(suggestedUser);
    } catch (error) {
        console.error("Error in getSuggested connections:", error);
        res.status(500).json({ message: "Server error" })
    }
}

export const getPublicProfile = async (req, res) => {
    
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);

    } catch (error) {
        console.error("Error in getPublicProfile:", error);
        res.status(500).json({ message: "server error" });
    }
}

export const updateProfile = async (req, res) => {

    try {
        const allowedFields = [
            "name",
            "username",
            "headline",
            "about",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education",
            "location",
            "isAdmin"
        ];

        const updateData = {};

        for (const field of allowedFields) {
            if (req.body[field]) {
                updateData[field] = req.body[field]
            }
        }

        if (req.body.profilePicture) {
            const result = await cloudinary.uploader.upload(req.body.profilePicture);
                updateData.profilePicture = result.secure_url;
        }

        if (req.body.bannerImg) {
            const result = await cloudinary.uploader.upload(req.body.bannerImg);
                updateData.bannerImg   = result.secure_url;
        }

        const user = await User.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true }).select("-password");

        res.json(user);

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const DeleteUser = async (req, res) => {

    const userId = req.params.id;

    try {
        await User.deleteOne({ _id: userId});

        res.json({ message: "User removed successfully" });
    } catch (error) {
        console.error("Error in remove user controller:", error);
		res.status(500).json({ message: "Server error" });
    }
}