import express from "express";
import { EmployeeModel } from "../models/employee.model.js";

export const getEmployees = async (req: express.Request, res: express.Response) => {
    try {
        const employees = await EmployeeModel.getAll();
        res.json(employees);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener empleados", error: error.message });
    }
};

export const getEmployeeById = async (req: express.Request, res: express.Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const employee = await EmployeeModel.getById(id);
        
        if (employee.length === 0) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }
        
        res.json(employee[0]);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener empleado", error: error.message });
    }
};

export const createEmployee = async (req: express.Request, res: express.Response) => {
    try {
        const { nombre, apellido, dni, cuil, direccion, municipio_id, cargo, especialidad, fecha_contratacion } = req.body;

        if (!nombre || !apellido || !dni || !cargo || !fecha_contratacion) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        const id = await EmployeeModel.create({
            nombre,
            apellido,
            dni: dni || '',
            cuil: cuil || '',
            direccion: direccion || '',
            municipio_id: municipio_id || 1,
            cargo,
            especialidad,
            fecha_contratacion
        });

        res.status(201).json({ id, message: "Empleado creado exitosamente" });
    } catch (error: any) {
        console.error(error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "DNI ya existe" });
        }
        
        res.status(500).json({ message: "Error al crear empleado", error: error.message });
    }
};

export const updateEmployee = async (req: express.Request, res: express.Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const result = await EmployeeModel.update(id, req.body);
        res.json(result);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar empleado", error: error.message });
    }
};

export const deleteEmployee = async (req: express.Request, res: express.Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const result = await EmployeeModel.delete(id);
        res.json(result);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar empleado", error: error.message });
    }
};

export const getInstructors = async (req: express.Request, res: express.Response) => {
    try {
        const instructors = await EmployeeModel.getInstructors();
        res.json(instructors);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener instructores", error: error.message });
    }
};
