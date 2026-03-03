import { db } from "./src/connect.js";

const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error: any, results: any) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

async function createTables() {
    try {
        console.log("🔧 Creando tablas faltantes...\n");

        // Tabla empleado
        await query(`
            CREATE TABLE IF NOT EXISTS empleado (
                id INT AUTO_INCREMENT PRIMARY KEY,
                persona_id INT NOT NULL,
                cargo VARCHAR(100) NOT NULL,
                especialidad VARCHAR(255),
                fecha_contratacion DATE NOT NULL,
                estado_id INT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (persona_id) REFERENCES persona(id) ON DELETE CASCADE,
                FOREIGN KEY (estado_id) REFERENCES tipo_estado(id)
            )
        `);
        console.log("✅ Tabla 'empleado' creada");

        // Tabla turno (reemplaza turnos_alta_usuario)
        await query(`
            CREATE TABLE IF NOT EXISTS turno (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fecha DATE NOT NULL,
                hora TIME NOT NULL,
                instructor_id INT NOT NULL,
                actividad VARCHAR(50) NOT NULL COMMENT 'Pilates/Yoga',
                tipo_pilates_id INT,
                capacidad INT DEFAULT 10,
                estado_id INT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (instructor_id) REFERENCES empleado(id),
                FOREIGN KEY (tipo_pilates_id) REFERENCES tipo_pilates(id),
                FOREIGN KEY (estado_id) REFERENCES tipo_estado(id),
                INDEX idx_fecha (fecha),
                INDEX idx_instructor (instructor_id, fecha, hora)
            )
        `);
        console.log("✅ Tabla 'turno' creada");

        // Tabla reserva
        await query(`
            CREATE TABLE IF NOT EXISTS reserva (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cliente_id INT NOT NULL,
                turno_id INT NOT NULL,
                estado VARCHAR(20) DEFAULT 'pendiente',
                fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                confirmacion_asistencia TIMESTAMP NULL,
                cancelacion TIMESTAMP NULL,
                motivo_cancelacion TEXT,
                FOREIGN KEY (cliente_id) REFERENCES user(id),
                FOREIGN KEY (turno_id) REFERENCES turno(id),
                INDEX idx_cliente (cliente_id),
                INDEX idx_estado (estado)
            )
        `);
        console.log("✅ Tabla 'reserva' creada");

        // Tabla plan
        await query(`
            CREATE TABLE IF NOT EXISTS plan (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(50) NOT NULL,
                tipo VARCHAR(20) NOT NULL,
                limite_semanal INT NOT NULL,
                precio DECIMAL(10,2) NOT NULL,
                descripcion TEXT,
                estado_id INT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Tabla 'plan' creada");

        // Tabla progreso
        await query(`
            CREATE TABLE IF NOT EXISTS progreso (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cliente_id INT NOT NULL,
                fecha DATE NOT NULL,
                peso DECIMAL(5,2),
                observaciones TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (cliente_id) REFERENCES user(id),
                INDEX idx_cliente_fecha (cliente_id, fecha)
            )
        `);
        console.log("✅ Tabla 'progreso' creada");

        // Tabla deuda
        await query(`
            CREATE TABLE IF NOT EXISTS deuda (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cliente_id INT NOT NULL,
                monto DECIMAL(10,2) NOT NULL,
                monto_original DECIMAL(10,2) NOT NULL,
                fecha_vencimiento DATE NOT NULL,
                intereses DECIMAL(10,2) DEFAULT 0,
                estado VARCHAR(20) DEFAULT 'pendiente',
                fecha_pago DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (cliente_id) REFERENCES user(id),
                INDEX idx_estado (estado)
            )
        `);
        console.log("✅ Tabla 'deuda' creada");

        // Tabla config_recargo
        await query(`
            CREATE TABLE IF NOT EXISTS config_recargo (
                id INT AUTO_INCREMENT PRIMARY KEY,
                dia_aplicacion INT DEFAULT 10,
                porcentaje DECIMAL(5,2) DEFAULT 5.0,
                tipo_interes VARCHAR(20) DEFAULT 'mensual',
                activo BOOLEAN DEFAULT TRUE
            )
        `);
        console.log("✅ Tabla 'config_recargo' creada");

        // Tabla password_reset_token
        await query(`
            CREATE TABLE IF NOT EXISTS password_reset_token (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                token VARCHAR(255) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
                INDEX idx_token (token)
            )
        `);
        console.log("✅ Tabla 'password_reset_token' creada");

        // Agregar columnas a persona (afecciones físicas)
        try {
            await query(`ALTER TABLE persona ADD COLUMN enfermedades TEXT`);
            console.log("✅ Columna 'enfermedades' agregada a persona");
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("ℹ️  Columna 'enfermedades' ya existe");
            }
        }

        try {
            await query(`ALTER TABLE persona ADD COLUMN cirugias TEXT`);
            console.log("✅ Columna 'cirugias' agregada a persona");
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("ℹ️  Columna 'cirugias' ya existe");
            }
        }

        try {
            await query(`ALTER TABLE persona ADD COLUMN limitaciones TEXT`);
            console.log("✅ Columna 'limitaciones' agregada a persona");
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("ℹ️  Columna 'limitaciones' ya existe");
            }
        }

        // Agregar plan_id a user
        try {
            await query(`ALTER TABLE user ADD COLUMN plan_id INT`);
            await query(`ALTER TABLE user ADD FOREIGN KEY (plan_id) REFERENCES plan(id)`);
            console.log("✅ Columna 'plan_id' agregada a user");
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("ℹ️  Columna 'plan_id' ya existe");
            }
        }

        // Insertar planes por defecto
        await query(`INSERT IGNORE INTO plan (id, nombre, tipo, limite_semanal, precio, descripcion) VALUES (1, 'Mensual 2 veces', 'mensual_2', 2, 20000, 'Plan mensual con 2 clases por semana')`);
        await query(`INSERT IGNORE INTO plan (id, nombre, tipo, limite_semanal, precio, descripcion) VALUES (2, 'Mensual 3 veces', 'mensual_3', 3, 25000, 'Plan mensual con 3 clases por semana')`);
        await query(`INSERT IGNORE INTO plan (id, nombre, tipo, limite_semanal, precio, descripcion) VALUES (3, 'Casual', 'casual', 99, 5000, 'Clase individual casual')`);
        console.log("✅ Planes insertados");

        // Insertar config recargo por defecto
        await query(`INSERT IGNORE INTO config_recargo (id, dia_aplicacion, porcentaje, tipo_interes) VALUES (1, 10, 5.0, 'mensual')`);
        console.log("✅ Configuración de recargo insertada");

        console.log("\n🎉 Todas las tablas creadas exitosamente!");
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        db.end();
    }
}

createTables();
