import { db } from "../src/connect.js";
import util from "util";
import bcrypt from "bcryptjs";

const query = util.promisify(db.query).bind(db);

async function fixHash() {
    try {
        console.log("Altering user table to extend password column...");
        await query("ALTER TABLE user MODIFY password VARCHAR(255)");

        console.log("Re-hashing admin password...");
        const salt = bcrypt.genSaltSync(10);
        const encrypt_password = bcrypt.hashSync("admin123", salt);
        await query("UPDATE user SET password = ? WHERE username = 'admin'", [encrypt_password]);

        console.log("Admin password re-hashed correctly. Length:", encrypt_password.length);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
fixHash();
