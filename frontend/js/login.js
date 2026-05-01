// frontend/js/login.js

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evitamos que la página se recargue

    const btn = document.getElementById('loginBtn');
    const msgBox = document.getElementById('messageBox');
    const usuario = document.getElementById('nombre_usuario').value;
    const contrasenia = document.getElementById('password').value;

    // Limpiar mensajes previos
    msgBox.innerHTML = '';
    // NUEVO: Validación rápida de campos vacíos
    if (usuario.trim() === '' || contrasenia.trim() === '') {
        msgBox.innerHTML = `
            <div class="p-3 mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                Por favor, completa ambos campos.
            </div>
        `;
        return; // Detenemos la ejecución aquí, no iniciamos el spinner
    }
    // 1. Estado de carga visual (Spinner)
    const originalBtnText = 'Ingresar';
    btn.disabled = true;
    btn.classList.add('opacity-75', 'cursor-not-allowed');
    btn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Validando credenciales...
    `;

    // 2. Simulamos la llamada al Backend (Node.js) con un retraso
    setTimeout(() => {
        // SIMULACIÓN: Si el usuario escribe 'admin' accede, sino da error.
        if (usuario === 'admin' && contrasenia !== '') {
            // Éxito
            msgBox.innerHTML = `
                <div class="p-3 mb-6 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                    ¡Acceso concedido! Redirigiendo al Dashboard...
                </div>
            `;
            btn.innerHTML = 'Redirigiendo...';

            // Simulamos la redirección hacia el dashboard
            setTimeout(() => {
                window.location.href = 'html/dashboard.html';
            }, 1000);

        } else {
            // Error de credenciales
            msgBox.innerHTML = `
                <div class="p-3 mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    Usuario o contraseña incorrectos. (Prueba con 'admin')
                </div>
            `;
            // Restaurar botón
            btn.disabled = false;
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
            btn.innerHTML = originalBtnText;
        }
    }, 1500);
});
function togglePassword() {
    // Obtenemos el elemento input, no solo su valor
    const passwordInput = document.getElementById('password');
    const eye = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eye.innerHTML = `
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a21.81 21.81 0 0 1 5.06-6.94"/>
            <path d="M9.88 9.88A3 3 0 1 0 14.12 14.12"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        `;
    } else {
        passwordInput.type = "password";
        eye.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
            <circle cx="12" cy="12" r="3"/>
        `;
    }
}