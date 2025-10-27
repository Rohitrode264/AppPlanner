import { Router } from "express";
import { registerUser, loginUser, getProfile } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", verifyToken, getProfile);

export default router;
