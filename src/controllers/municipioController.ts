import express from "express";
import { MunicipioModel } from "../models/municipio.model.js";

export const getMunicipio = async (req: express.Request, res: express.Response) => {
    try {
        const localidades: any = await MunicipioModel.getMunicipios();
        if (!localidades || localidades.length === 0) {
            console.log("esta vacio");
            return res.status(404).json({ message: "No se encontraron municipios" });
        }
        res.status(200).json(localidades);
    } catch (error: any) {
        console.error("error en la query", error.message);
        res.status(500).json({ message: "error en la base de datos" });
    }
};