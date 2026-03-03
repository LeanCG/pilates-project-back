# Diseño Backend - Sistema de Gestión de Pilates

## 1) Arquitectura detallada

### 1.1 Estructura de Capas
```
Back-End/src/
├── controllers/      # Orquestación de requests y respuestas HTTP
├── models/          # Acceso a datos y lógica de DB (mysql2/promise)
├── routes/          # Definición de endpoints REST
├── middlewares/     # Validaciones, auth, rate limiting
├── services/        # Lógica de negocio compleja (jobs, recargos)
├── utils/           # Funciones helper (fechas, validación)
├── types/           # DTOs y tipos TypeScript
├── connect.ts       # Conexión MySQL
└── index.ts         # Configuración Express
```

### 1.2 Patrones Aplicados
- **MVC**: Controllers manejan HTTP, Models manejan DB
- **Transactions**: Para operaciones atómicas (crear usuario + factura + turno)
- **Repository Pattern**: Models actúan como repositorios de datos
- **Service Layer**: Lógica de negocio compleja (recargos, cupos)

---

## 2) Diseño de Datos (Schema MySQL)

### 2.1 Tablas Existentes (mantenidas)
| Tabla | Estado |
|-------|--------|
| persona | ✅ existente |
| user | ✅ existente |
| direccion | ✅ existente |
| rol | ✅ existente |
| tipo_estado | ✅ existente |
| municipio | ✅ existente |
| ejercicio | ✅ existente |
| rutina | ✅ existente |
| rutina_ejercicio | ✅ existente |
| cabecera_factura | ✅ existente |
| detalle_factura | ✅ existente |
| turnos_alta_usuario | ⚠️ existente (renombrar a turno) |
| tipo_pilates | ✅ existente |

### 2.2 Tablas Nuevas Requeridas

```sql
-- Empleados/Instructores
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
);

-- Turnos (reemplaza turnos_alta_usuario)
CREATE TABLE IF NOT EXISTS turno (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    instructor_id INT NOT NULL,
    actividad VARCHAR(50) NOT NULL COMMENT 'Pilates/Yoga',
    tipo_pilates_id INT,
    capacidad INT DEFAULT 10 CHECK (capacidad <= 10),
    estado_id INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES empleado(id),
    FOREIGN KEY (tipo_pilates_id) REFERENCES tipo_pilates(id),
    FOREIGN KEY (estado_id) REFERENCES tipo_estado(id),
    INDEX idx_fecha (fecha),
    INDEX idx_instructor (instructor_id, fecha, hora)
);

-- Reservas
CREATE TABLE IF NOT EXISTS reserva (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    turno_id INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' COMMENT 'pendiente/confirmada/cancelada/asistio/no_asistio',
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmacion_asistencia TIMESTAMP NULL,
    cancelacion TIMESTAMP NULL,
    motivo_cancelacion TEXT,
    FOREIGN KEY (cliente_id) REFERENCES user(id),
    FOREIGN KEY (turno_id) REFERENCES turno(id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_estado (estado)
);

-- Planes
CREATE TABLE IF NOT EXISTS plan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    tipo VARCHAR(20) NOT NULL COMMENT 'mensual_2/mensual_3/casual',
    limite_semanal INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    estado_id INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progreso Físico
CREATE TABLE IF NOT EXISTS progreso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha DATE NOT NULL,
    peso DECIMAL(5,2),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES user(id),
    INDEX idx_cliente_fecha (cliente_id, fecha)
);

-- Detalle Progreso (ejercicios realizados)
CREATE TABLE IF NOT EXISTS progreso_ejercicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    progreso_id INT NOT NULL,
    ejercicio_id INT NOT NULL,
    repeticiones INT,
    series INT,
    duracion_minutos INT,
    FOREIGN KEY (progreso_id) REFERENCES progreso(id) ON DELETE CASCADE,
    FOREIGN KEY (ejercicio_id) REFERENCES ejercicio(id)
);

-- Deudas
CREATE TABLE IF NOT EXISTS deuda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    monto_original DECIMAL(10,2) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    intereses DECIMAL(10,2) DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'pendiente' COMMENT 'pendiente/pagada/cancelada',
    fecha_pago DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES user(id),
    INDEX idx_estado (estado)
);

-- Configuración Recargo
CREATE TABLE IF NOT EXISTS config_recargo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dia_aplicacion INT DEFAULT 10,
    porcentaje DECIMAL(5,2) DEFAULT 5.0,
    tipo_interes VARCHAR(20) DEFAULT 'mensual',
    activo BOOLEAN DEFAULT TRUE
);

-- Tokens Recuperación Password
CREATE TABLE IF NOT EXISTS password_reset_token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    INDEX idx_token (token)
);

-- Afecciones Físicas (nuevo campo en persona o tabla relacionada)
ALTER TABLE persona ADD COLUMN enfermedades TEXT;
ALTER TABLE persona ADD COLUMN cirugias TEXT;
ALTER TABLE persona ADD COLUMN limitaciones TEXT;
ALTER TABLE persona ADD COLUMN observaciones TEXT;

-- Plan en user
ALTER TABLE user ADD COLUMN plan_id INT;
ALTER TABLE user ADD FOREIGN KEY (plan_id) REFERENCES plan(id);
```

---

## 3) Contratos API

### 3.1 Autenticación

#### POST /api/auth/login
- **Auth**: Pública
- **Request**: `{ username: string, password: string }`
- **Response 200**: `{ token: string, user: { id, username, rol, nombre, apellido } }`
- **Errors**: 401 Credenciales inválidas

#### POST /api/auth/forgot-password
- **Auth**: Pública
- **Request**: `{ email: string }`
- **Response 200**: `{ message: "Token enviado" }`
- **Errors**: 404 Email no existe

#### POST /api/auth/reset-password
- **Auth**: Pública (token)
- **Request**: `{ token: string, newPassword: string }`
- **Response 200**: `{ message: "Password actualizada" }`
- **Errors**: 400 Token inválido/expirado

### 3.2 Usuarios/Clientes

#### GET /api/users
- **Auth**: Token, Admin
- **Response 200**: `{ users: [...] }`

#### GET /api/users/:id
- **Auth**: Token, Admin/Cliente mismo
- **Response 200**: `{ id, nombre, apellido, dni, plan, enfermedades, ... }`

#### POST /api/users
- **Auth**: Token, Admin
- **Request**:
```json
{
  "nombre": "string",
  "apellido": "string", 
  "dni": "string",
  "cuil": "string",
  "direccion": "string",
  "municipio_id": "number",
  "username": "string",
  "password": "string",
  "plan_id": "number",
  "enfermedades": "string",
  "cirugias": "string",
  "limitaciones": "string"
}
```
- **Response 201**: `{ id, message: "Cliente creado" }`
- **Errors**: 409 DNI/Username existe, 400 Validación falla

#### PUT /api/users/:id
- **Auth**: Token, Admin
- **Request**: Same as POST (campos opcionales)
- **Response 200**: `{ message: "Actualizado" }`

#### DELETE /api/users/:id
- **Auth**: Token, Admin
- **Response 200**: `{ message: "Dado de baja" }`

### 3.3 Empleados

#### GET /api/employees
- **Auth**: Token, Admin
- **Response 200**: `{ employees: [...] }`

#### GET /api/employees/:id
- **Auth**: Token, Admin
- **Response 200**: `{ employee: {...} }`

#### POST /api/employees
- **Auth**: Token, Admin
- **Request**:
```json
{
  "nombre": "string",
  "apellido": "string",
  "dni": "string",
  "cuil": "string",
  "direccion": "string",
  "municipio_id": "number",
  "cargo": "string",
  "especialidad": "string",
  "fecha_contratacion": "YYYY-MM-DD"
}
```
- **Response 201**: `{ id, message: "Empleado creado" }`

#### PUT /api/employees/:id
- **Auth**: Token, Admin
- **Request**: Same as POST (campos opcionales)
- **Response 200**: `{ message: "Actualizado" }`

#### DELETE /api/employees/:id
- **Auth**: Token, Admin
- **Response 200**: `{ message: "Empleado dado de baja" }`

### 3.4 Turnos

#### GET /api/shifts
- **Auth**: Token
- **Query**: `?fecha=YYYY-MM-DD&instructor_id=1`
- **Response 200**: `{ shifts: [...] }`

#### GET /api/shifts/:id
- **Auth**: Token
- **Response 200**: `{ shift: {...},cupo_disponible: number }`

#### POST /api/shifts
- **Auth**: Token, Admin
- **Request**:
```json
{
  "fecha": "YYYY-MM-DD",
  "hora": "HH:MM",
  "instructor_id": "number",
  "actividad": "Pilates",
  "tipo_pilates_id": "number"
}
```
- **Response 201**: `{ id, message: "Turno creado" }`
- **Errors**: 400 Fecha pasada, 409 Conflicto instructor

#### PUT /api/shifts/:id
- **Auth**: Token, Admin
- **Request**: Same as POST (campos opcionales)
- **Response 200**: `{ message: "Turno actualizado" }`

#### DELETE /api/shifts/:id
- **Auth**: Token, Admin
- **Response 200**: `{ message: "Turno eliminado" }`

### 3.5 Reservas

#### GET /api/reservations
- **Auth**: Token
- **Query**: `?estado=pendiente&fecha=YYYY-MM-DD`
- **Response 200**: `{ reservations: [...] }`

#### GET /api/reservations/available
- **Auth**: Token
- **Query**: `?fecha=YYYY-MM-DD`
- **Response 200**: `{ shifts: [...] withcupo_disponible }`

#### POST /api/reservations
- **Auth**: Token, Cliente
- **Request**: `{ turno_id: number }`
- **Response 201**: `{ id, message: "Reserva creada" }`
- **Errors**: 400 Cupo lleno, 400 Límite semanal alcanzado, 400 Cliente moroso

#### PUT /api/reservations/:id/confirm
- **Auth**: Token, Cliente Dueño
- **Response 200**: `{ message: "Asistencia confirmada" }`
- **Errors**: 400 Tiempo de confirmación vencido (<30min)

#### PUT /api/reservations/:id/cancel
- **Auth**: Token, Cliente Dueño
- **Response 200**: `{ message: "Reserva cancelada" }`
- **Errors**: 400 Cancelación tardía (/<1h), 400 Ya asistió

### 3.6 Progreso

#### GET /api/progress/:clienteId
- **Auth**: Token, Admin/Cliente mismo
- **Response 200**: `{ progreso: [...], peso_historial: [...], ejercicios: [...] }`

#### POST /api/progress/weight
- **Auth**: Token, Cliente
- **Request**: `{ peso: number, fecha: YYYY-MM-DD, observaciones: string }`
- **Response 201**: `{ id, message: "Peso registrado" }`

#### POST /api/progress/exercises
- **Auth**: Token, Cliente
- **Request**:
```json
{
  "fecha": "YYYY-MM-DD",
  "rutina_id": "number",
  "ejercicios": [
    { "ejercicio_id": 1, "repeticiones": 10, "series": 3 }
  ]
}
```
- **Response 201**: `{ id, message: "Progreso registrado" }`

### 3.7 Planes

#### GET /api/plans
- **Auth**: Token
- **Response 200**: `{ plans: [...] }`

### 3.8 Deudas

#### GET /api/debts
- **Auth**: Token, Admin
- **Query**: `?cliente_id=1&estado=pendiente`
- **Response 200**: `{ debts: [...] }`

#### GET /api/debts/my-debts
- **Auth**: Token, Cliente
- **Response 200**: `{ debts: [...], total: number }`

### 3.9 Rutinas (Asignación)

#### GET /api/routines/assigned
- **Auth**: Token, Cliente
- **Response 200**: `{ routines: [...] }`

#### POST /api/routines/assign
- **Auth**: Token, Admin/Instructor
- **Request**: `{ cliente_id: number, rutina_id: number }`
- **Response 201**: `{ message: "Rutina asignada" }`

---

## 4) Reglas de Negocio y Validaciones

### 4.1 Cupo de Turnos (10 plazas)
```typescript
// En reservation.service.ts
async function validarCupo(turnoId: number): Promise<boolean> {
    const [turno] = await db.query('SELECT capacidad FROM turno WHERE id = ?', [turnoId]);
    const [reservas] = await db.query(
        'SELECT COUNT(*) as total FROM reserva WHERE turno_id = ? AND estado NOT IN ("cancelada")',
        [turnoId]
    );
    return reservas[0].total < turno[0].capacidad;
}
```
- **Concurrencia**: Usar transacción con `SELECT ... FOR UPDATE` o constraint CHECK

### 4.2 Confirmación Asistencia (30 min antes)
```typescript
// En reservation.service.ts  
async function confirmarAsistencia(reservaId: number, clienteId: number): Promise<void> {
    const [reserva] = await db.query(
        `SELECT r.*, t.fecha, t.hora FROM reserva r 
         JOIN turno t ON r.turno_id = t.id 
         WHERE r.id = ? AND r.cliente_id = ?`,
        [reservaId, clienteId]
    );
    
    const ahora = new Date();
    const fechaTurno = new Date(`${reserva[0].fecha} ${reserva[0].hora}`);
    const diffMs = fechaTurno.getTime() - ahora.getTime();
    const diffMin = diffMs / (1000 * 60);
    
    if (diffMin < 30) {
        throw new Error('Tiempo de confirmación vencido (mínimo 30 min antes)');
    }
}
```

### 4.3 Cancelación (1 hora antes)
```typescript
async function cancelarReserva(reservaId: number, clienteId: number): Promise<void> {
    // Misma lógica que arriba pero con 60 minutos
    if (diffMin < 60) {
        // Aplicar lógica de multa si está configurada
        await aplicarMulta(clienteId);
    }
}
```

### 4.4 Límite Semanal por Plan
```typescript
async function validarLimiteSemanal(clienteId: number): Promise<boolean> {
    const [user] = await db.query('SELECT plan_id FROM user WHERE id = ?', [clienteId]);
    const [plan] = await db.query('SELECT limite_semanal FROM plan WHERE id = ?', [user[0].plan_id]);
    
    const inicioSemana = getInicioSemana(); // Monday 00:00
    const finSemana = getFinSemana(); // Sunday 23:59
    
    const [reservasSemana] = await db.query(
        `SELECT COUNT(*) as total FROM reserva r
         JOIN turno t ON r.turno_id = t.id
         WHERE r.cliente_id = ? AND r.estado NOT IN ("cancelada")
         AND t.fecha BETWEEN ? AND ?`,
        [clienteId, inicioSemana, finSemana]
    );
    
    return reservasSemana[0].total < plan[0].limite_semanal;
}
```

### 4.5 Recargo Post Día 10 (Job)
```typescript
// services/recargo.service.ts
async function aplicarRecargos(): Promise<void> {
    const [config] = await db.query('SELECT * FROM config_recargo WHERE activo = true');
    const diaActual = new Date().getDate();
    
    if (diaActual >= config[0].dia_aplicacion) {
        const [deudas] = await db.query(
            `SELECT * FROM deuda WHERE estado = 'pendiente' 
             AND DATE(fecha_vencimiento) < CURDATE()`
        );
        
        for (const deuda of deudas) {
            // Verificar si ya tiene recargo aplicado este período
            const [yaAplicado] = await db.query(
                'SELECT id FROM deuda WHERE cliente_id = ? AND intereses > 0 AND MONTH(fecha_vencimiento) = MONTH(CURDATE())',
                [deuda.cliente_id]
            );
            
            if (yaAplicado.length === 0) {
                const nuevoMonto = deuda.monto * (1 + config[0].porcentaje / 100);
                await db.query(
                    'UPDATE deuda SET intereses = ?, monto = ? WHERE id = ?',
                    [nuevoMonto - deuda.monto_original, nuevoMonto, deuda.id]
                );
            }
        }
    }
}
```

---

## 5) Plan de Testing

### 5.1 Unit Tests (Jest)

| Test | Qué Valida |
|------|------------|
| `calcularDescuento` | precio * (1 - descuento/100) |
| `validarCupo_TurnoCompleto` | Rechaza cuando cupo = 10 |
| `validarCupo_ConCupo` | Permite cuando hay lugar |
| `confirmarAsistencia_30min` | Permite confirmación válida |
| `confirmarAsistencia_29min` | Rechaza por tiempo |
| `cancelarReserva_1hora` | Permite cancelación válida |
| `cancelarReserva_59min` | Rechaza o aplica multa |
| `limiteSemanal_Mensual2` | Permite máximo 2 reservas |
| `limiteSemanal_Excede` | Rechaza al tercer intento |
| `recargo_Idempotente` | No aplica dos veces |
| `hashPassword` | bcrypt genera hash válido |

### 5.2 Integration Tests (Supertest)

| Test | Escenario |
|------|-----------|
| `POST /auth/login_Invalid` | 401 con credenciales wrong |
| `POST /users_Create` | 201 y usuario en DB |
| `POST /users_DuplicateDNI` | 409 Conflict |
| `POST /reservations_CupoLleno` | 400 Cupo agotado |
| `POST /reservations_Concurrency` | Solo 10 reservas max |
| `PUT /reservations/confirm_TimeOut` | 400 Tiempo vencido |
| `DELETE /shifts_ConReservas` | 400 No se puede eliminar |

---

## 6) Seguridad

### 6.1 Autenticación (JWT)
```typescript
// middlewares/auth.ts
interface JWTPayload {
    id: number;
    rol: string;
    username: string;
}

const generateToken = (user: User): string => {
    return jwt.sign(
        { id: user.id, rol: user.rol_id, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
    );
};
```

### 6.2 Autorización por Roles
```typescript
// middlewares/authorize.ts
function authorize(allowedRoles: string[]) {
    return (req, res, next) => {
        const user = req.user as JWTPayload;
        if (!allowedRoles.includes(user.rol)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
}

// Uso en rutas
router.post('/users', authenticate, authorize(['admin']), createUser);
```

### 6.3 Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const generalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 100
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', loginLimiter);
```

### 6.4 Validaciones (Zod)
```typescript
import { z } from 'zod';

export const createUserSchema = z.object({
    nombre: z.string().min(2).max(100),
    apellido: z.string().min(2).max(100),
    dni: z.string().min(7).max(20),
    username: z.string().min(4).max(50),
    password: z.string().min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/),
    plan_id: z.number().int().positive(),
});

export const createShiftSchema = z.object({
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    hora: z.string().regex(/^\d{2}:\d{2}$/),
    instructor_id: z.number().int().positive(),
    actividad: z.enum(['Pilates', 'Yoga']),
    tipo_pilates_id: z.number().int().positive().optional(),
});
```

### 6.5 OWASP Top 10 Mitigations
| Vulnerabilidad | Mitigación |
|---------------|------------|
| A01 Broken Access Control | Middleware authorize() en todas las rutas |
| A02 Cryptographic Failures | bcryptjs con salt rounds 10 |
| A03 Injection | mysql2 con parámetros `?`, nunca interpolación |
| A04 Insecure Design | Validaciones Zod en inputs |
| A05 Security Misconfiguration | Headers secure, CORS configurado |
| A06 Vulnerable Components | npm audit regular |
| A07 Auth Failures | Rate limiting + intentos limitados |
| A08 Data Integrity Failures | Transacciones en operaciones atómicas |
| A09 Logging Failures | Winston con logs de auditoría |
| A10 SSRF | Validar URLs externas si aplica |

---

## 7) Jobs/Cron

```typescript
// services/cron.ts
import cron from 'node-cron';

cron.schedule('0 0 * * *', async () => {
    console.log('Ejecutando job de recargos...');
    await aplicarRecargos();
});

cron.schedule('0 * * * *', async () => {
    console.log('Verificando confirmaciones pendientes...');
    await verificarAsistencias();
});
```

---

## 8) Definition of Done

- [x] Arquitectura MVC con capas separadas
- [x] Schema DB completo con todas las entidades
- [x] Endpoints REST siguen convenciones naming
- [x] Validaciones Zod en request bodies
- [x] Transacciones en operaciones atómicas
- [x] Control de concurrencia para cupos
- [x] Middleware JWT + authorize por roles
- [x] Rate limiting configurado
- [x] Job de recargo post día 10
- [x] Unit tests para lógica crítica
- [x] Integration tests para endpoints clave
- [x] OWASP mitigations documentadas

---

*Diseño generado por Agente Backend*
*Fecha: 2026-02-28*
