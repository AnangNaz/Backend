import express from "express";
import db from "./config/db.js";
import router from "./routes/index.js";
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config();
const app = express();

try {
    await db.authenticate()
    console.log('database connected')
} catch (error) {
    console.log(error)
}

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);
app.use(express.json())
app.use(router)


app.listen(5001, () => console.log('server running on port 5001'))