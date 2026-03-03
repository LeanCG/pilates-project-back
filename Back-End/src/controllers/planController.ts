import express from "express";
import { PlanModel } from "../models/plan.model.js";

export const getPlans = async (req: express.Request, res: express.Response) => {
    try {
        const plans = await PlanModel.getAll();
        res.json(plans);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener planes", error: error.message });
    }
};

export const getPlanById = async (req: express.Request, res: express.Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const plan = await PlanModel.getById(id);
        
        if (!plan) {
            return res.status(404).json({ message: "Plan no encontrado" });
        }
        
        res.json(plan);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener plan", error: error.message });
    }
};
