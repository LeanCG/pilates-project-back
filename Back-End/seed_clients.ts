/**
 * Seed script for test clients.
 * Creates sample clients with user accounts for testing the frontend.
 * 
 * Run: npx tsx seed_clients.ts
 */
import { db } from "./src/connect.js";
import bcrypt from "bcryptjs";
import util from "util";

const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error: any, results: any) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

const clients = [
    {
        nombre: "Juan",
        apellido: "Pérez",
        dni: "12345678",
        cuil: "20123456789",
        direccion: "Calle Principal 123",
        username: "juanperez",
        password: "cliente123",
        municipio_id: 1,
        tipo_persona_id: 1,
        rol_id: 2,
        tipo_pilates_id: 1,
        fecha_turno: "2024-01-15",
        hora: "10:00:00",
        numero_factura: "0001-00000001",
        cantidad: 4,
        sub_total: 20000,
        descuento: 0
    },
    {
        nombre: "María",
        apellido: "González",
        dni: "23456789",
        cuil: "27234567890",
        direccion: "Avenida Central 456",
        username: "mariagonzalez",
        password: "cliente123",
        municipio_id: 1,
        tipo_persona_id: 1,
        rol_id: 2,
        tipo_pilates_id: 1,
        fecha_turno: "2024-01-16",
        hora: "14:00:00",
        numero_factura: "0001-00000002",
        cantidad: 4,
        sub_total: 20000,
        descuento: 2000
    },
    {
        nombre: "Carlos",
        apellido: "Rodríguez",
        dni: "34567890",
        cuil: "20345678901",
        direccion: "Plaza Mayor 789",
        username: "carlosrodriguez",
        password: "cliente123",
        municipio_id: 2,
        tipo_persona_id: 1,
        rol_id: 2,
        tipo_pilates_id: 2,
        fecha_turno: "2024-01-17",
        hora: "09:00:00",
        numero_factura: "0001-00000003",
        cantidad: 8,
        sub_total: 40000,
        descuento: 0
    },
    {
        nombre: "Ana",
        apellido: "Martínez",
        dni: "45678901",
        cuil: "27456789012",
        direccion: "Calle Norte 321",
        username: "anamartinez",
        password: "cliente123",
        municipio_id: 1,
        tipo_persona_id: 1,
        rol_id: 2,
        tipo_pilates_id: 1,
        fecha_turno: "2024-01-18",
        hora: "16:00:00",
        numero_factura: "0001-00000004",
        cantidad: 4,
        sub_total: 20000,
        descuento: 1000
    },
    {
        nombre: "Pedro",
        apellido: "Sánchez",
        dni: "56789012",
        cuil: "20567890123",
        direccion: "Avenida Sur 654",
        username: "pedrosanchez",
        password: "cliente123",
        municipio_id: 3,
        tipo_persona_id: 1,
        rol_id: 2,
        tipo_pilates_id: 3,
        fecha_turno: "2024-01-19",
        hora: "11:00:00",
        numero_factura: "0001-00000005",
        cantidad: 12,
        sub_total: 60000,
        descuento: 6000
    }
];

async function seedClients() {
    console.log("👥 Seeding clients...\n");

    const beginTransaction = util.promisify(db.beginTransaction).bind(db);
    const commit = util.promisify(db.commit).bind(db);
    const rollback = util.promisify(db.rollback).bind(db);

    for (const client of clients) {
        try {
            await beginTransaction();

            const encryptedPassword = await bcrypt.hash(client.password, 10);

            // 1. Insertar Direccion
            let results: any = await query(
                'INSERT INTO direccion (descripcion, municipio_id) VALUES (?, ?)',
                [client.direccion, client.municipio_id]
            );
            const idNuevaDireccion = results.insertId;

            // 2. Insertar Persona
            results = await query(
                'INSERT INTO persona (apellido, nombre, dni, cuil, direccion_id, tipo_persona_id) VALUES (?, ?, ?, ?, ?, ?)',
                [client.apellido, client.nombre, client.dni, client.cuil, idNuevaDireccion, client.tipo_persona_id]
            );
            const idNuevaPersona = results.insertId;

            // 3. Insertar Usuario
            results = await query(
                'INSERT INTO user (username, password, created_at, updated_at, persona_id, rol_id, tipo_estado_id) VALUES (?, ?, NOW(), NOW(), ?, ?, 1)',
                [client.username, encryptedPassword, idNuevaPersona, client.rol_id]
            );
            const idNuevoUser = results.insertId;

            // 4. Insertar Turno
            await query(
                'INSERT INTO turnos_alta_usuario (fecha_turno, hora, user_id, tipo_pilates_id, tipo_estado_id) VALUES (?, ?, ?, ?, 1)',
                [client.fecha_turno, client.hora, idNuevoUser, client.tipo_pilates_id]
            );

            // 5. Insertar Factura
            results = await query(
                'INSERT INTO cabecera_factura (fecha_factura, numero_factura, sub_total, descuento, comprador_id) VALUES (NOW(), ?, ?, ?, ?)',
                [client.numero_factura, client.sub_total, client.descuento, idNuevaPersona]
            );
            const idNuevaFactura = results.insertId;

            // 6. Insertar Detalle Factura
            const finalPrice = client.sub_total - client.descuento;
            await query(
                'INSERT INTO detalle_factura (cantidad, precio, cabecera_factura_id) VALUES (?, ?, ?)',
                [client.cantidad, finalPrice, idNuevaFactura]
            );

            await commit();
            console.log(`✅ ${client.nombre} ${client.apellido} - DNI: ${client.dni}`);

        } catch (error: any) {
            await rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                console.log(`⚠️  ${client.nombre} ${client.apellido} (DNI: ${client.dni}) - Ya existe`);
            } else {
                console.log(`❌ Error con ${client.nombre} ${client.apellido}: ${error.message}`);
            }
        }
    }

    console.log("\n🎉 Proceso de seeding de clientes completado.");
    db.end();
}

seedClients();
