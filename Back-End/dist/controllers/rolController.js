import { RolModel } from "../models/rol.model.js";
export const getRol = async (req, res) => {
    try {
        const roles = await RolModel.getRoles();
        if (!roles || roles.length === 0) {
            return res.status(404).json({ error: "No se encontraron roles" });
        }
        res.status(200).json(roles);
    }
    catch (error) {
        console.error("error:", error.message);
        res.status(500).json({ message: error.message });
    }
};
