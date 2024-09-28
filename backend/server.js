import express from 'express'
import dotenv from "dotenv";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import notificationsRoutes from './routes/notification.route.js'
import connectionRoutes from './routes/connection.route.js'
import { connectDB } from './lib/db.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

if (process.env.NODE_ENV !== "production") {
	
}


app.use(cookieParser())
app.use(express.json({limit:"5mb"}))

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/posts", postRoutes)
app.use("/api/v1/notifications", notificationsRoutes)
app.use("/api/v1/connections", connectionRoutes)


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDB()
})