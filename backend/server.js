import express from 'express'
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/v1/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})