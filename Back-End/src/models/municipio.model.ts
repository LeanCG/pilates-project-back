import { db } from "../connect.js";
import util from "util";

const query = util.promisify(db.query).bind(db);

export class MunicipioModel {
    static async getMunicipios() {
        return query("SELECT * FROM municipio");
    }
}
