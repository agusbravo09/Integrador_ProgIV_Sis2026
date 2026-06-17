// Obtiene el token y crea las cabeceras requeridas para las peticiones API
export function getHeaders(extraHeaders = {}) {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...extraHeaders
    };
}
