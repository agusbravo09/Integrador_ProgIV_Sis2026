export const inscripcionDTO = (data) => {
    return {
        id_curso: data.id_curso ? parseInt(data.id_curso, 10) : null,
        id_estudiante: data.id_estudiante ? parseInt(data.id_estudiante, 10) : null,
        id_inscripcion_estado: data.id_inscripcion_estado !== undefined ? parseInt(data.id_inscripcion_estado, 10) : 1, // Por defecto 1 (Confirmada)
        id_usuario_modificacion: data.id_usuario_modificacion !== undefined ? parseInt(data.id_usuario_modificacion, 10) : 1
    };
};

export const validateInscripcionDTO = (dto) => {
    const errors = [];
    if (!dto.id_curso || isNaN(dto.id_curso)) {
        errors.push("El ID del curso es obligatorio y debe ser un número válido");
    }
    if (!dto.id_estudiante || isNaN(dto.id_estudiante)) {
        errors.push("El ID del estudiante es obligatorio y debe ser un número válido");
    }
    return errors;
};
