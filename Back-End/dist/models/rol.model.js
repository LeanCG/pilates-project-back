import { db } from "../connect.js";
import util from "util";
const query = util.promisify(db.query).bind(db);
export class RolModel {
    static async getRoles() {
        return query("SELECT * FROM rol");
    }
}
