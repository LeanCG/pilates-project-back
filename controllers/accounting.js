import {db} from '../connect.js'
import util from 'util'
import { calcularDescuento } from '../middlewares/descuento.js'

const query = util.promisify(db.query).bind(db)

export const handleTransaction = async (req, res) => {

    try {

        const {dni} = req.body
        
        const datos = await query('SELECT id, nombre FROM persona WHERE dni = ?', [dni])

        if (!datos.length) {
            return res.status(409).json('Usuario no existente')
        }

        const {id} = datos[0]

        let precio = req.body.monto

        const valores_cabecera = [req.body.fecha, req.body.nro_factura,precio ,req.body.descuento, req.body.tipo_factura, id]

        const resultados = await query('INSERT INTO cabecera_factura (`fecha_factura`, `numero_factura`, `sub_total`, `descuento`, `tipo_factura`, `comprador_id`) VALUES (?)', [valores_cabecera])

        const idNuevaFactura = resultados.insertId

        if (Number(req.body.descuento) > 0){
            precio = calcularDescuento(precio, req.body.descuento)
        }

        const values_detalle_factura = [req.body.detalle, precio, idNuevaFactura]

        await query('INSERT INTO detalle_factura (`detalle`, `precio`, `cabecera_factura_id`) VALUES (?)', [values_detalle_factura])

        res.status(200).json("Éxito padre.")


    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
}

export const getFacturas = async (req, res) => {
    try {
        const sql = `
            SELECT cf.fecha_factura, df.detalle, df.precio, cf.tipo_factura
            FROM cabecera_factura cf
            INNER JOIN detalle_factura df ON cf.id = df.cabecera_factura_id
            WHERE cf.tipo_factura IN (1, 2, 3)
        `;
        const facturas = await query(sql);
        res.status(200).json(facturas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las facturas' });
    }
};

