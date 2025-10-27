import { Router } from "express";
import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require authentication
router.post("/", verifyToken, createApplication);
router.get("/", verifyToken, getApplications);
router.put("/:id", verifyToken, updateApplication);
router.delete("/:id", verifyToken, deleteApplication);

export default router;
