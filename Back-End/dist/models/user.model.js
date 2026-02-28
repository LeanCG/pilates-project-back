import { db } from "../connect.js";
import util from "util";
const query = (sql, values) => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error, results) => {
            if (error)
                return reject(error);
            resolve(results);
        });
    });
};
export class UserModel {
    /**
     * Updates the state of a user.
     * @param personaId - ID of the persona.
     * @param stateId - ID of the new state.
     * @returns A promise that resolves when the update is complete.
     */
    static async updateState(personaId, stateId) {
        return query('UPDATE user SET `tipo_estado_id` = ? WHERE persona_id = ?', [stateId, personaId]);
    }
    /**
     * Finds a persona by DNI.
     * @param dni - The DNI to search for.
     * @returns A promise that resolves to the persona data.
     */
    static async findByDni(dni) {
        const q = "SELECT dni FROM persona WHERE dni = ?";
        const result = await query(q, [dni]);
        return result;
    }
    /**
     * Finds a username excluding a specific persona ID.
     * @param username - The username to search for.
     * @param excludePersonaId - The persona ID to exclude from the search.
     * @returns A promise that resolves to the result of the search.
     */
    static async findByUsernameExcludingId(username, excludePersonaId) {
        const q = "SELECT id FROM user WHERE username = ? AND persona_id != ?";
        const result = await query(q, [username, excludePersonaId]);
        return result;
    }
    /**
     * Creates a complete user including dynamic data such as address, persona, auth user, turn, and invoice.
     * @param clientData - The data of the client to create.
     * @param encryptedPassword - The encrypted password for the user.
     * @param finalPrice - The final price for the invoice.
     * @returns A promise that resolves when the creation is complete.
     * @throws Error if any part of the transaction fails.
     */
    static async createCompleteUser(clientData, encryptedPassword, finalPrice) {
        // Transaction helper
        const beginTransaction = util.promisify(db.beginTransaction).bind(db);
        const commit = util.promisify(db.commit).bind(db);
        const rollback = util.promisify(db.rollback).bind(db);
        try {
            await beginTransaction();
            // 1. Insertar Direccion
            const values_direccion = [[clientData.direccion, clientData.municipio_id]];
            let results = await query('INSERT INTO direccion (`descripcion`, `municipio_id`) VALUES ?', [values_direccion]);
            const idNuevaDireccion = results.insertId;
            // 2. Insertar Persona
            const values_persona = [[clientData.apellido, clientData.nombre, clientData.dni, clientData.cuil, idNuevaDireccion, clientData.tipo_persona_id]];
            results = await query('INSERT INTO persona (`apellido`, `nombre`, `dni`, `cuil`, `direccion_id`, `tipo_persona_id`) VALUES ?', [values_persona]);
            const idNuevaPersona = results.insertId;
            // 3. Insertar Usuario Auth
            const values_user = [[clientData.username, encryptedPassword, new Date(), new Date(), idNuevaPersona, clientData.rol_id, 1]];
            results = await query('INSERT INTO user (`username`, `password`, `created_at`, `updated_at`, `persona_id`, `rol_id`, `tipo_estado_id`) VALUES ?', [values_user]);
            const idNuevoUser = results.insertId;
            // 4. Insertar Turno Alta
            const values_turn = [[clientData.fecha_turno, clientData.hora, idNuevoUser, clientData.tipo_pilates_id, 1, clientData.dias_turno_id]];
            await query('INSERT INTO turnos_alta_usuario (`fecha_turno`, `hora`, `user_id`, `tipo_pilates_id`, `tipo_estado_id`, `dias_turno_id`) VALUES ?', [values_turn]);
            // 5. Insertar Cabecera Factura
            const values_factura = [[clientData.fecha_turno, clientData.numero_factura, clientData.sub_total, clientData.descuento, idNuevaPersona]];
            results = await query('INSERT INTO cabecera_factura (`fecha_factura`, `numero_factura`, `sub_total`, `descuento`, `comprador_id`) VALUES ?', [values_factura]);
            const idNuevaFactura = results.insertId;
            // 6. Insertar Detalle Factura
            const values_detalle_factura = [[clientData.cantidad, finalPrice, idNuevaFactura]];
            await query('INSERT INTO detalle_factura (`cantidad`, `precio`, `cabecera_factura_id`) VALUES ?', [values_detalle_factura]);
            await commit();
        }
        catch (err) {
            await rollback();
            throw err;
        }
    }
    /**
     * Updates an existing user.
     * @param personaId - The persona ID of the user to update.
     * @param editPersona - The persona data to update.
     * @param editUsuario - The user data to update.
     * @returns A promise that resolves when the update is complete.
     * @throws Error if the transaction fails.
     */
    static async updateUser(personaId, editPersona, editUsuario) {
        // Simple transaction
        const beginTransaction = util.promisify(db.beginTransaction).bind(db);
        const commit = util.promisify(db.commit).bind(db);
        const rollback = util.promisify(db.rollback).bind(db);
        try {
            await beginTransaction();
            const values_persona = [
                editPersona.apellido, editPersona.nombre, editPersona.dni,
                editPersona.cuil, editPersona.direccion_id, editPersona.tipo_persona_id
            ];
            await query('UPDATE persona SET `apellido` = ?, `nombre` = ?, `dni` = ?, `cuil` = ?, `direccion_id` = ?, `tipo_persona_id` = ? WHERE `id` = ?', [...values_persona, personaId]);
            const values_user = [
                editUsuario.username, editUsuario.password, editUsuario.created_at,
                editUsuario.updated_at, editUsuario.rol_id, editUsuario.tipo_estado_id
            ];
            await query('UPDATE user SET `username` = ?, `password` = ?, `created_at` = ?, `updated_at` = ?, `rol_id` = ?, `tipo_estado_id` = ? WHERE `persona_id` = ?', [...values_user, personaId]);
            await commit();
        }
        catch (err) {
            await rollback();
            throw err;
        }
    }
    /**
     * Updates an existing user with partial data.
     * @param personaId - The persona ID of the user to update.
     * @param editPersona - Partial persona data.
     * @param editUsuario - Partial user data.
     * @returns A promise that resolves when the update is complete.
     */
    static async updateUsuarioPartial(personaId, editPersona, editUsuario) {
        const beginTransaction = util.promisify(db.beginTransaction).bind(db);
        const commit = util.promisify(db.commit).bind(db);
        const rollback = util.promisify(db.rollback).bind(db);
        try {
            await beginTransaction();
            await query('UPDATE persona SET ? WHERE id = ?', [editPersona, personaId]);
            await query('UPDATE user SET ? WHERE persona_id = ?', [editUsuario, personaId]);
            await commit();
        }
        catch (err) {
            await rollback();
            throw err;
        }
    }
    /**
     * Lists all users with their associated persona and address information.
     * @returns A promise that resolves to a list of users.
     */
    static async listUsers() {
        const sql = `
        SELECT 
            p.id, p.nombre, p.apellido, p.dni, p.cuil,
            d.descripcion AS direccion,
            tp.descripcion AS tipo_persona,
            u.tipo_estado_id AS estado
        FROM persona p
        JOIN user u ON p.id = u.persona_id
        JOIN direccion d ON p.direccion_id = d.id
        JOIN tipo_persona tp ON p.tipo_persona_id = tp.id;
        `;
        return query(sql);
    }
    /**
     * Gets detailed information for a specific user.
     * @param userId - ID of the user persona to fetch.
     * @returns A promise that resolves to the detailed user information.
     */
    static async infoUser(userId) {
        const sql = `
        SELECT 
            p.id AS persona_id, p.apellido, p.nombre, p.dni, p.cuil,
            d.descripcion AS direccion, m.descripcion AS municipio,
            depto.descripcion AS departamento, prov.descripcion AS provincia,
            pais.descripcion AS pais, tp.descripcion AS tipo_persona,
            u.username, u.created_at, u.updated_at,
            r.descripcion AS rol, te.descripcion AS tipo_estado
        FROM user u
        INNER JOIN persona p ON u.persona_id = p.id
        INNER JOIN direccion d ON p.direccion_id = d.id
        INNER JOIN municipio m ON d.municipio_id = m.id
        INNER JOIN departamento depto ON m.departamento_id = depto.id
        INNER JOIN provincia prov ON depto.provincia_id = prov.id
        INNER JOIN pais pais ON prov.pais_id = pais.id
        INNER JOIN tipo_persona tp ON p.tipo_persona_id = tp.id
        INNER JOIN rol r ON u.rol_id = r.id
        INNER JOIN tipo_estado te ON u.tipo_estado_id = te.id
        WHERE p.id = ?  
        `;
        return query(sql, [userId]);
    }
}
