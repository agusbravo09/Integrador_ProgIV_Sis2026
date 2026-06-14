import express from 'express';
import cors from 'cors';
import router from './src/routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ─────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Rutas ────────────────────────────────────────────────────────────────────
app.use('/api', router);

// ── Manejador global de errores (siempre al final) ──────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Error interno del servidor' });
});

// ── Arranque ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
