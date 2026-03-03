import { db } from "./src/connect.js";
import util from "util";
import bcrypt from "bcryptjs";

const query = util.promisify(db.query).bind(db);

async function checkLogin() {
    try {
        console.log("Checking DB for user 'admin'...");
        const users: any = await query("SELECT id, username, password, rol_id FROM user WHERE username = 'admin'");
        console.log("Users found:", users.length);
        if (users.length > 0) {
            const user = users[0];
            console.log("User data:", user);
            const isValid = bcrypt.compareSync("admin123", user.password);
            console.log("Is 'admin123' valid for this hash?", isValid);
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
checkLogin();
