import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pilates Studio API',
            version: '1.0.0',
            description: 'API REST para la gestión integral de un estudio de Pilates. Incluye autenticación, gestión de usuarios/clientes, rutinas, ejercicios, facturación y dashboard.',
            contact: {
                name: 'LeanCG',
                email: 'leandrocorrea040@gmail.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo',
            },
        ],
        tags: [
            { name: 'Auth', description: 'Autenticación y sesión' },
            { name: 'Users', description: 'Gestión de usuarios/clientes' },
            { name: 'Routines', description: 'Gestión de rutinas de ejercicio' },
            { name: 'Exercises', description: 'Catálogo de ejercicios' },
            { name: 'Accounting', description: 'Movimientos de caja y facturación' },
            { name: 'Dashboard', description: 'Métricas y estadísticas del estudio' },
            { name: 'Catalogs', description: 'Catálogos auxiliares (municipios, roles)' },
        ],
        components: {
            schemas: {
                LoginRequest: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: { type: 'string', example: 'admin' },
                        password: { type: 'string', example: '123456' },
                    },
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', description: 'JWT de sesión' },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer' },
                                username: { type: 'string' },
                                rol_id: { type: 'integer' },
                            },
                        },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        nombre: { type: 'string' },
                        apellido: { type: 'string' },
                        dni: { type: 'string' },
                        cuil: { type: 'string' },
                        username: { type: 'string' },
                        tipo_estado_id: { type: 'integer', description: '1=activo, 2=inactivo' },
                    },
                },
                CreateUserRequest: {
                    type: 'object',
                    required: ['nombre', 'apellido', 'dni', 'cuil', 'direccion', 'username', 'password'],
                    properties: {
                        nombre: { type: 'string', example: 'María' },
                        apellido: { type: 'string', example: 'García' },
                        dni: { type: 'string', example: '40123456' },
                        cuil: { type: 'string', example: '20-40123456-7' },
                        direccion: { type: 'string', example: 'Av. Siempre Viva 742' },
                        municipio_id: { type: 'integer', example: 1 },
                        tipo_persona_id: { type: 'integer', example: 1 },
                        username: { type: 'string', example: 'maria.g' },
                        password: { type: 'string', example: 'secureP@ss' },
                        rol_id: { type: 'integer', example: 2 },
                        fecha_turno: { type: 'string', format: 'date', example: '2026-03-01' },
                        hora: { type: 'string', example: '08:00' },
                        tipo_pilates_id: { type: 'integer', example: 1 },
                        dias_turno_id: { type: 'integer', example: 1 },
                        precio: { type: 'number', example: 15000 },
                        descuento: { type: 'number', example: 10 },
                        cantidad: { type: 'integer', example: 1 },
                    },
                },
                Exercise: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        descripcion: { type: 'string' },
                    },
                },
                Routine: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        rutina: { type: 'string' },
                        exercises: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    ejercicio_id: { type: 'integer' },
                                    ejercicio: { type: 'string' },
                                    series: { type: 'integer' },
                                    repeticiones: { type: 'integer' },
                                },
                            },
                        },
                    },
                },
                CreateRoutineRequest: {
                    type: 'object',
                    required: ['rutina', 'exercises'],
                    properties: {
                        rutina: { type: 'string', example: 'Pilates Mat Intermedio' },
                        exercises: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    ejercicio_id: { type: 'integer', example: 1 },
                                    series: { type: 'integer', example: 3 },
                                    repeticiones: { type: 'integer', example: 12 },
                                },
                            },
                        },
                    },
                },
                Movement: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        descripcion: { type: 'string' },
                        fecha: { type: 'string', format: 'date' },
                        ingreso: { type: 'number' },
                        egreso: { type: 'number' },
                    },
                },
                TransactionRequest: {
                    type: 'object',
                    required: ['fecha', 'dni', 'detalle', 'tipo_factura', 'nro_factura', 'monto'],
                    properties: {
                        fecha: { type: 'string', format: 'date', example: '2026-03-01' },
                        dni: { type: 'string', example: '40123456' },
                        detalle: { type: 'string', example: 'Pago mensualidad' },
                        tipo_factura: { type: 'integer', example: 3, description: '1=Compra (egreso), 3=Venta (ingreso)' },
                        nro_factura: { type: 'string', example: '0001' },
                        monto: { type: 'number', example: 15000 },
                        descuento: { type: 'number', example: 0 },
                    },
                },
                DashboardStats: {
                    type: 'object',
                    properties: {
                        totalClientes: { type: 'integer' },
                        clientesActivos: { type: 'integer' },
                        totalRutinas: { type: 'integer' },
                        ingresosMes: { type: 'number' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
