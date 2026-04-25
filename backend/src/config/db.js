import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('error', (err) => {
  console.error('Error inesperado en cliente idle del pool:', err);
  process.exit(-1);
});

// wrapper para queries simples
export const query = (text, params) => pool.query(text, params);

// devuelve un client para usar en transacciones
export const getClient = () => pool.connect();

export default pool;
