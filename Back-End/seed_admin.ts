import { db } from "./src/connect.js";
import bcrypt from "bcryptjs";
import util from "util";

const query = util.promisify(db.query).bind(db);

async function seed() {
    try {
        console.log("Seeding base user 'admin' with password 'admin123'...");

        // Ensure roles exist
        await query("INSERT IGNORE INTO rol (id, descripcion) VALUES (1, 'Admin'), (2, 'Común'), (3, 'Instructor')");
        await query("INSERT IGNORE INTO tipo_estado (id, descripcion) VALUES (1, 'Activo'), (2, 'Inactivo')");
        await query("INSERT IGNORE INTO tipo_persona (id, descripcion) VALUES (1, 'Física'), (2, 'Jurídica')");
        await query("INSERT IGNORE INTO municipio (id, descripcion) VALUES (1, 'Capital')");

        // Insert a base direction
        const dirRes: any = await query("INSERT INTO direccion (descripcion, municipio_id) VALUES ('Base', 1)");
        const dirId = dirRes.insertId;

        // Insert a persona
        const personaRes: any = await query("INSERT INTO persona (apellido, nombre, dni, cuil, direccion_id, tipo_persona_id) VALUES ('Administrador', 'Sistema', '00000000', '0000000000', ?, 1)", [dirId]);
        const personaId = personaRes.insertId;

        // Create the admin user
        const salt = bcrypt.genSaltSync(10);
        const encrypt_password = bcrypt.hashSync("admin123", salt);
        const now = new Date().toISOString().split('T')[0];

        await query("INSERT INTO user (username, password, created_at, updated_at, persona_id, rol_id, tipo_estado_id) VALUES ('admin', ?, ?, ?, ?, 1, 1)", [encrypt_password, now, now, personaId]);

        console.log("Usuario 'admin' creado exitosamente. Contraseña: admin123");
    } catch (error) {
        console.error("Error seeding user:", error);
    } finally {
        process.exit(0);
    }
}

seed();
