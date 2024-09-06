import express from 'express';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import indexRoutes from './routes/login.js'
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

// Rutas de la API
app.use('/api/users', userRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/likes', likeRoutes);
// app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('/', indexRoutes);

// Servir HTML
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'login.ejs'));
// });

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
