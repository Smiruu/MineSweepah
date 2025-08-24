import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./apps/authentication/authRoutes.js"

dotenv.config()
const app = express()
const PORT = process.env.PORT;

app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRoutes)

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})