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

        const valores_cabecera = [req.body.fecha, req.body.nro_factura,precio ,req.body.descuento, req.body.tipo_factura,req.body.movimiento_caja_id, id]

        const resultados = await query('INSERT INTO cabecera_factura (`fecha_factura`, `numero_factura`, `sub_total`, `descuento`, `tipo_factura`,`movimiento_caja_id`, `comprador_id`) VALUES (?)', [valores_cabecera])

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
            SELECT cf.id,cf.fecha_factura, df.detalle, df.precio, cf.tipo_factura, cf.movimiento_caja_id
            FROM cabecera_factura cf
            INNER JOIN detalle_factura df ON cf.id = df.cabecera_factura_id
        `;
        const facturas = await query(sql);
        res.status(200).json(facturas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las facturas' });
    }
};

export const GetFacturaById = async (req, res) => {
    try {
        const {id} = req.params;
        const consulta = `
            SELECT 
                cabecera.id AS cabecera_id,
                cabecera.fecha_factura,
                cabecera.numero_factura,
                cabecera.sub_total,
                tipo_factura.descripcion as descripcion_tipo_factura,
                concat(cliente.apellido, ' ', cliente.nombre) AS cliente_nya,
                cabecera.movimiento_caja_id,
                cliente.cuil,
                direccion.descripcion AS direccion,
                detalle.id AS detalle_id,
                detalle.detalle AS detalle_descripcion,
                detalle.cantidad AS detalle_cantidad,
                detalle.precio AS detalle_precio
            FROM 
                pilates.cabecera_factura AS cabecera
			INNER JOIN pilates.tipo_factura ON cabecera.tipo_factura = tipo_factura.id
            INNER JOIN 
                pilates.persona AS cliente ON cliente.id = cabecera.comprador_id
            INNER JOIN 
                pilates.direccion ON cliente.direccion_id = direccion.id
            INNER JOIN 
                pilates.detalle_factura AS detalle ON detalle.cabecera_factura_id = cabecera.id
            WHERE 
                cabecera.id = ?
        `;

        // Ejecuta la consulta utilizando `query` y verifica el resultado
        const result = await query(consulta,[id]);

        // Si el resultado no es un array o está vacío, retornar un mensaje de error
        if (!Array.isArray(result) || !result.length) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

        // Estructura los datos en el formato deseado
        const facturas = {};

        result.forEach(row => {
            if (!facturas[row.cabecera_id]) {
                facturas[row.cabecera_id] = {
                    cliente_nya: row.cliente_nya,
                    cuil:row.cuil,
                    movimiento_caja_id:row.movimiento_caja_id,
                    fecha_factura: row.fecha_factura,
                    numero_factura: row.numero_factura,
                    sub_total: row.sub_total,
                    descripcion_tipo_factura: row.descripcion_tipo_factura,
                    direccion: row.direccion,
                    detalle_factura: {}
                };
            }

            facturas[row.cabecera_id].detalle_factura[row.detalle_id] = {
                detalle_id: row.detalle_id,
                descripcion: row.detalle_descripcion,
                cantidad: row.detalle_cantidad,
                precio: row.detalle_precio
            };
        });

        res.json(Object.values(facturas)); // Enviar el resultado como JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la factura');
    }
}


