import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './db';
import userRoute from './routes/user.route'; // Ensure correct import

dotenv.config();
const app = express();
connectDB();

app.get("/", (_req: any, res: { send: (arg0: string) => void; }) => {
    res.send("hello world..");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Corrected CORS options
const corsOptions = {
    origin: 'http://localhost:5317',
    credentials: true
};

app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
