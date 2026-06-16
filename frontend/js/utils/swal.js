// Colores del proyecto
const COLOR_PRIMARY = '#1e40af';
const COLOR_DANGER = '#dc2626';
const COLOR_CANCEL = '#64748b';

// Confirmar eliminación
export async function confirmarEliminacion(nombre) {
    const result = await Swal.fire({
        title: "¿Está seguro?",
        html: `Va a eliminar <strong>"${nombre}"</strong>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: COLOR_DANGER,
        cancelButtonColor: COLOR_CANCEL,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });
    return result.isConfirmed;
}

// Mostrar éxito
export function mostrarExito(mensaje) {
    return Swal.fire({
        title: "¡Listo!",
        text: mensaje,
        icon: "success",
        timer: 1500,
        showConfirmButton: false
    });
}

// Mostrar error
export function mostrarError(mensaje) {
    return Swal.fire({
        title: "Error",
        text: mensaje,
        icon: "error",
        confirmButtonColor: COLOR_PRIMARY
    });
}