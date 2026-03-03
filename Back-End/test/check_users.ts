import { db } from "../src/connect.js";
import bcrypt from "bcryptjs";
import util from "util";

const query = util.promisify(db.query).bind(db);

async function seed() {
    try {
        console.log("Comprobando usuarios...");
        const users: any = await query("SELECT * FROM user");
        if (users.length > 0) {
            console.log("Usuarios existentes:", users);
            // Let's reset the password of the first user to "admin123" just in case
            const userId = users[0].id;
            const username = users[0].username;
            const salt = bcrypt.genSaltSync(10);
            const encrypt_password = bcrypt.hashSync("admin123", salt);
            await query("UPDATE user SET password = ? WHERE id = ?", [encrypt_password, userId]);
            console.log(`Contraseña del usuario ${username} actualizada a: admin123`);
        } else {
            console.log("No hay usuarios. Creando uno...");
            // Seed base tables if needed or just insert a direct user?
            // Since we don't know the exact schema, we'll try to find an existing user first.
            console.log("Por favor, crea un usuario base o provee más datos.");
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        process.exit(0);
    }
}

seed();
