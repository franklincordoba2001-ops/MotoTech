import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import './config/db.js';

// Importación de rutas con extensión .js (Obligatorio)
import configRoutes from './routes/configRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import motoRoutes from './routes/motoRoutes.js';
import ordenRoutes from './routes/ordenRoutes.js';
import facturaRoutes from './routes/facturaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import reporteRoutes from './routes/reporteRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import rolRoutes from './routes/rolRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Registro de rutas
app.use('/api/clientes', clienteRoutes);
app.use('/api/motos', motoRoutes);
app.use('/api/ordenes', ordenRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/config', configRoutes);

app.get('/', (req, res) => {
    res.send('API Taller Mecánico funcionando correctamente');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});