export const cursoDTO = (data) => {
    const dto = {
        nombre: data.nombre ? String(data.nombre).trim() : null,
        descripcion: data.descripcion ? String(data.descripcion).trim() : null,
        fecha_inicio: data.fecha_inicio ? String(data.fecha_inicio).trim() : null,
        cantidad_horas: data.cantidad_horas ? parseInt(data.cantidad_horas, 10) : null,
        inscriptos_max: data.inscriptos_max ? parseInt(data.inscriptos_max, 10) : null
    };

    if (data.id_curso_estado !== undefined) {
        dto.id_curso_estado = parseInt(data.id_curso_estado, 10);
    }

    return dto;
};

export const validateCursoDTO = (dto) => {
    const errors = [];
    if (!dto.nombre) errors.push("El nombre es obligatorio");
    if (!dto.descripcion) errors.push("La descripción es obligatoria");

    if (!dto.fecha_inicio) {
        errors.push("La fecha de inicio es obligatoria");
    } else if (isNaN(Date.parse(dto.fecha_inicio))) {
        errors.push("La fecha de inicio no es una fecha válida");
    }

    if (!dto.cantidad_horas || isNaN(dto.cantidad_horas) || dto.cantidad_horas <= 0) {
        errors.push("La cantidad de horas es obligatoria y debe ser mayor a 0");
    }

    if (!dto.inscriptos_max || isNaN(dto.inscriptos_max) || dto.inscriptos_max <= 0) {
        errors.push("La cantidad máxima de inscriptos es obligatoria y debe ser mayor a 0");
    }

    if (dto.id_curso_estado !== undefined && isNaN(dto.id_curso_estado)) {
        errors.push("El estado del curso debe ser un valor numérico válido");
    }

    return errors;
};
