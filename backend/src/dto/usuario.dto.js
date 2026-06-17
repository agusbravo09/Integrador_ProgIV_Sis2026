export const usuarioDTO = (data) => {
    return {
        apellido: data.apellido ? String(data.apellido).trim() : null,
        nombre: data.nombre ? String(data.nombre).trim() : null,
        nombre_usuario: data.nombre_usuario ? String(data.nombre_usuario).trim() : null,
        contrasenia: data.contrasenia ? String(data.contrasenia).trim() : null
    };
};

export const validateUsuarioDTO = (dto) => {
    const errors = [];
    if (!dto.apellido) errors.push("El apellido es obligatorio");
    if (!dto.nombre) errors.push("El nombre es obligatorio");
    if (!dto.nombre_usuario) errors.push("El nombre de usuario es obligatorio");
    if (!dto.contrasenia) errors.push("La contraseña es obligatoria");
    
    return errors;
};
