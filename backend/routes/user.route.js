import express from 'express';
import { login, logOut, register } from '../controller/user.controller.js';
const router = express.Router();


// Define the routes
router.get('/register', register)
router.get('/login', login)
router.get('/logout', logOut)
export default router