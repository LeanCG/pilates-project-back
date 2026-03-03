import express from "express";
import { AccountingModel } from "../models/accounting.model.js";
import { calcularDescuento } from "../middlewares/descuento.js";

/**
 * Handles a new accounting transaction (e.g., payment from a client).
 * Calculates final price with discount and creates the record.
 * @param req - Express request object with transaction data in body.
 * @param res - Express response object.
 */
export const handleTransaction = async (req: express.Request, res: express.Response) => {
    try {
        const { dni, monto, fecha, nro_factura, descuento, tipo_factura, detalle } = req.body;

        const datos: any = await AccountingModel.findPersonaByDni(dni);

        if (!datos || !datos.length) {
            return res.status(409).json('Usuario no existente');
        }

        const comprador_id = datos[0].id;
        let precioFinal = monto;

        if (Number(descuento) > 0) {
            precioFinal = calcularDescuento(monto, descuento);
        }

        await AccountingModel.createTransaction({
            fecha,
            nro_factura,
            precioBase: monto,
            precioFinal,
            descuento,
            tipo_factura,
            comprador_id,
            detalle
        });

        res.status(200).json("Éxito al registrar factura.");
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Retrieves all registered invoices for the accounting table.
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const getFacturas = async (req: express.Request, res: express.Response) => {
    try {
        const facturas = await AccountingModel.getFacturas();
        res.status(200).json(facturas);
    } catch (error: any) {
        res.status(500).json({ error: 'Error al obtener las facturas', details: error.message });
    }
};
