export const estudianteDTO = (data) => {
    return {
        documento: data.documento ? String(data.documento).trim() : null,
        apellido: data.apellido ? String(data.apellido).trim() : null,
        nombres: data.nombres ? String(data.nombres).trim() : null,
        email: data.email ? String(data.email).trim() : null,
        fecha_nacimiento: data.fecha_nacimiento ? String(data.fecha_nacimiento).trim() : null,
    };
};

export const validateEstudianteDTO = (dto) => {
    const errors = [];
    if (!dto.documento) errors.push("El documento es obligatorio");
    if (!dto.apellido) errors.push("El apellido es obligatorio");
    if (!dto.nombres) errors.push("El nombre es obligatorio");
    
    if (!dto.email) {
        errors.push("El email es obligatorio");
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(dto.email)) {
        errors.push("El email no tiene un formato válido");
    }

    if (!dto.fecha_nacimiento) {
        errors.push("La fecha de nacimiento es obligatoria");
    } else if (isNaN(Date.parse(dto.fecha_nacimiento))) {
        errors.push("La fecha de nacimiento no es una fecha válida");
    }

    return errors;
};
