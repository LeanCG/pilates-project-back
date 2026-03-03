import express from "express";
import { DashboardModel } from "../models/dashboard.model.js";

/**
 * Retrieves essential dashboard metrics (user counts, active routines, etc.).
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const getDashboard = async (req: express.Request, res: express.Response) => {
    try {
        const dashboard: any = await DashboardModel.getMetrics();

        if (!dashboard || dashboard.length === 0) {
            console.log("Dashboard vacío");
            return res.status(404).json({ message: "Dashboard metrics not found" });
        }

        return res.status(200).json(dashboard);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
