import { ErrorHandler, TryCatch } from "@kuldeepverma/errorhandler";
import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export const register = TryCatch(async (req, res, next) => {
    const { username, email, password, role} = req.body;
    if (!username || !password || !email || !role) {
        return new ErrorHandler("Every fields must be provided", 401)
    }
    const user = await User.findOne({ email: email })
    if (user) {
        return next(new ErrorHandler("Email already registered", 409))
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, email, password:hashedPassword, role:role })
    await newUser.save()
    // generate token
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })

    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    newUser.password = undefined
    return res.status(200).cookie("token", token, options).json({
        message: `Welcome back ${newUser.username}`,
        user: newUser,
        success: true
    })

})

export const login = TryCatch(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(new ErrorHandler("All fields are required", 400))
    }
    let user = await User.findOne({ email })

    if (!user) {
        return next(new ErrorHandler("User not exist", 404))
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new ErrorHandler("Incorrect Email or Password", 404))
    }
    // check role is correct or not
    if (user.role !== role) {
        return next(new ErrorHandler("Invalid Role", 401))
    }
    // generate token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })
   

    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    user.password = undefined
    return res.status(200).cookie("token", token, options).json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true
    })

})


export const logOut = TryCatch(async (req, res, next) => {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
        success: true,
        message: "Logged out successfully"
    })
})