import { db } from "./src/connect.js";

const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error: any, results: any) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

async function createRoutineAssignmentTable() {
    try {
        console.log("🔧 Creando tabla rutina_asignada...\n");

        await query(`
            CREATE TABLE IF NOT EXISTS rutina_asignada (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cliente_id INT NOT NULL,
                rutina_id INT NOT NULL,
                instructor_id INT NOT NULL,
                fecha_asignacion DATE NOT NULL,
                observaciones TEXT,
                activa BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (cliente_id) REFERENCES user(id),
                FOREIGN KEY (rutina_id) REFERENCES rutina(id),
                FOREIGN KEY (instructor_id) REFERENCES user(id),
                INDEX idx_cliente (cliente_id),
                INDEX idx_activa (activa)
            )
        `);
        console.log("✅ Tabla 'rutina_asignada' creada");

        console.log("\n🎉 Tabla creada exitosamente!");
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        db.end();
    }
}

createRoutineAssignmentTable();
