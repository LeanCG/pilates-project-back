import { db } from "./src/connect.js";
import util from "util";

const query = util.promisify(db.query).bind(db);

async function checkSchema() {
    try {
        console.log("Checking user table schema...");
        const columns = await query("DESCRIBE user");
        console.log(columns);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
checkSchema();
