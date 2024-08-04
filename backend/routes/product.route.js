import express from 'express';
import { createProduct } from '../controller/product.controller.js';
import auth from '../middleware/auth.js';
import { verifyRole } from '../middleware/verifyRole.js';
const router = express.Router();

// Define the routes
router.post('/create',auth, verifyRole,createProduct)
export default router;