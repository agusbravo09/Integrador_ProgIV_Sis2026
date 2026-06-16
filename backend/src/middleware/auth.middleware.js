import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    // Leer la cabecera de Authorization
    const authHeader = req.headers['authorization'];

    // Esperamos el formato: Bearer <TOKEN>
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no provisto.' });
    }

    try {
        // Verificar firma y validez del token
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);

        // Guardamos los datos decodificados del usuario en el objeto request
        req.user = decodificado;

        next(); // Continuar al siguiente controlador/middleware
    } catch (err) {
        res.status(403).json({ message: 'Token inválido o expirado' });
    }
};
