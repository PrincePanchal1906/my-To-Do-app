import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', (req, res) => {
    res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",  
});
    res.status(200).json({ message: "Logged out successfully" });
});
router.get("/me",authMiddleware ,(req, res) => {
    res.json({ user: req.user || null });
});

export default router;
