import express from 'express';
import exerciseRoutes from './routes/exerciseRoutes.js'
import routineRoutes from "./routes/routineRoutes.js";
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import municipioRoutes from './routes/municipioRoutes.js'
import rolRoutes from './routes/rolRoutes.js'
import accountingRoutes from './routes/accountingRoutes.js'
import dashboard from './routes/dashboardRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import shiftRoutes from './routes/shiftRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import planRoutes from './routes/planRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import debtRoutes from './routes/debtRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';
import fs from 'fs';
import { RecargoService } from './services/recargo.service.js';
// Crear una instancia de Express
const app = express();

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true")
    next()
})

app.use(express.json());
app.use(express.static(path.join(__dirname, '../Front-End/dist'))); // Servir app compilada de React
app.use(cors({
    origin: '*', // Permitir cualquier origen. Cambiar según sea necesario.
}));
app.use(cookieParser());

app.use((req, res, next) => {
    const method = req.method;
    const url = req.originalUrl;
    res.on('finish', () => {
        console.log(`${method}${url}/${res.statusCode}`);
    });
    next();
});

app.use('/api/accounting', accountingRoutes)
app.use('/api/users', userRoutes);
app.use('/api/users', rolRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/plans', planRoutes);
app.use('/api', progressRoutes);
app.use('/api', debtRoutes);
app.use('/api/exercise', exerciseRoutes)
app.use('/api/routine', routineRoutes);
app.use('/api', municipioRoutes)
app.use('/api/auth', authRoutes);
app.use('/api', dashboard)

// Swagger UI – documentación interactiva de la API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Fallback para React Router: servir index.html en cualquier otra ruta no API
app.get('*', (req, res) => {
    // Si es una ruta de API que no existía, devolvemos 404 real en JSON
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ message: 'Ruta de API no encontrada' });
    }

    const indexPath = path.join(__dirname, '../Front-End/dist/index.html');

    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        // En desarrollo, el frontend suele correr en otro puerto o el build no existe aún
        res.status(404).json({
            message: 'Frontend build not found. If in dev, use the Front-End dev server.',
            hint: 'Run "npm run build" in the Front-End folder to generate production assets.'
        });
    }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    RecargoService.startScheduler();
});
