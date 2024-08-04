import express from "express";
import { rateLimit } from 'express-rate-limit';
import { errorMiddleware } from '@kuldeepverma/errorhandler';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import productRoute from "./routes/product.route.js";
import userRoute from "./routes/user.route.js";
import session from 'express-session';

dotenv.config({});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // Adjust secure: true in production
}));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

connectDB();
app.use(limiter);

console.log("first checkpoint");

app.use('/api/user', userRoute);
app.use('/api/product', productRoute);

app.use(errorMiddleware);

app.use("/", () => { "Hello from express app" });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
