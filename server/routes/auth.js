import express from 'express';
import { login, signup, getMe, refreshToken, logout } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

export default router;
