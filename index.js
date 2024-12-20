import express from 'express';
import exerciseRoutes from './routes/exerciseRoutes.js'
import routineRoutes from "./routes/routineRoutes.js"; 
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import municipioRoutes from './routes/municipioRoutes.js'
import loginRoutes from './routes/loginRoutes.js'
import rolRoutes from './routes/rolRoutes.js'
import accountingRoutes from './routes/accountingRoutes.js'
import dashboard from './routes/dashboardRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// Crear una instancia de Express
const app = express();

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use((req,res, next) =>{
    res.header("Access-Control-Allow-Credentials", true)
    next()
})

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos desde 'public'
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors({
    origin: '*', // Permitir cualquier origen. Cambiar según sea necesario.
}));
app.use(cookieParser());

app.use((req,res, next)=> {
    const method = req.method;
    const url = req.originalUrl;
    res.on('finish',() =>{console.log(`${method}${url}/${res.statusCode}`);
});
next();
});

app.use('/api/accounting', accountingRoutes)
app.use('/api/users', userRoutes);
app.use('/api/users', rolRoutes);
app.use('/api/exercise',exerciseRoutes)
app.use('/api/routine', routineRoutes); 
app.use('/api', municipioRoutes)
app.use('/api/auth', authRoutes);
app.use('/api', dashboard)
app.use('/', loginRoutes);

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
