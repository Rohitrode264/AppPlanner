import { type Response } from "express";
import { Application } from "../models/Application.js";
import { User } from "../models/User.js";
import { scheduleReminders } from "../utils/scheduler.js";
import { type AuthRequest } from "../middleware/authMiddleware.js";

export const createApplication = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { title, type, deadline, notes, status } = req.body;

        const application = new Application({
            title,
            type,
            status: status || "Not Started",
            deadline,
            notes,
            userId,
        });

        await application.save();

        if (deadline) {
            const user = await User.findById(userId);
            if (user) {
                scheduleReminders(application, user.email);
            }
        }

        res.status(201).json(application);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getApplications = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const apps = await Application.find({ userId }).sort({ deadline: 1 });
        res.status(200).json(apps);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const updateApplication = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const updated = await Application.findOneAndUpdate(
            { _id: id, userId },
            req.body,
            { new: true }
        );

        if (!updated)
            return res.status(404).json({ message: "Application not found" });

        if (updated.deadline) {
            const user = await User.findById(userId);
            if (user) {
                scheduleReminders(updated, user.email);
            }
        }

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteApplication = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const deleted = await Application.findOneAndDelete({ _id: id, userId });
        if (!deleted)
            return res.status(404).json({ message: "Application not found" });

        res.status(200).json({ message: "Application deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
