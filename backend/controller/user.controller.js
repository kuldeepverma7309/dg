import { ErrorHandler, TryCatch } from "@kuldeepverma/errorhandler";
import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";

export const register = TryCatch(async (req, res, next) => {
    const { username, email, password, role } = req.body;
    if (!username || !password || !email || !role) {
        return next(new ErrorHandler("Every fields must be provided", 401));
    }
    const user = await User.findOne({ email: email });
    if (user) {
        return next(new ErrorHandler("Email already registered", 409));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role: role });
    await newUser.save();

    req.session.userId = newUser._id;
    req.session.role = newUser.role;

    newUser.password = undefined;
    return res.status(200).json({
        message: `Welcome back ${newUser.username}`,
        user: newUser,
        success: true
    });
});

export const login = TryCatch(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(new ErrorHandler("All fields are required", 400));
    }
    let user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("User not exist", 404));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new ErrorHandler("Incorrect Email or Password", 404));
    }
    if (user.role !== role) {
        return next(new ErrorHandler("Invalid Role", 401));
    }

    req.session.userId = user._id;
    req.session.role = user.role;

    user.password = undefined;
    return res.status(200).json({
        message: `Welcome back ${user.username}`,
        user,
        success: true
    });
});

export const logOut = TryCatch(async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(new ErrorHandler("Logout failed", 500));
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    });
});
