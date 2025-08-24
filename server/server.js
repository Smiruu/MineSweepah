import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./apps/authentication/authRoutes.js"

dotenv.config()
const app = express()
const PORT = process.env.PORT;

app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use("/api/auth", authRoutes)

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})