import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"

// custom file and function
import connectDB  from "./config/connectdb.js"
import router from "./routes/userRoutes.js"
const app = express()
const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

// CORS policy
app.use(cors())

// database connection
connectDB(DATABASE_URL)

// json
app.use(express.json())

// load Routes
app.use("/api/user", router)
app.listen(PORT , ()=>{
    console.log(`server is listing at http://localhost:${PORT}`);
})