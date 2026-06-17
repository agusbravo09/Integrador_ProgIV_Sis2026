# Sistema de Inscripción a Cursos (API REST)

Este proyecto es una API RESTful construida con Node.js, Express y PostgreSQL para gestionar un sistema de inscripciones a cursos. 

## Arquitectura por Capas

El proyecto está diseñado bajo una arquitectura de capas para separar responsabilidades, facilitar la mantenibilidad y escalar de forma ordenada:

1.  **Capa de Rutas (`src/routes.js`)**: 
    Define los endpoints expuestos por la API y los redirige al controlador correspondiente.
2.  **Capa de Controladores (`src/controller/`)**: 
    Se encarga de procesar las peticiones HTTP. Aquí se captura los datos entrantes, se valida mediante los **DTOs**, y si es correcta, se llama a la capa de Servicios. Por último, maneja los códigos de estado HTTP de respuesta (Ej. `201 Created`, `400 Bad Request`, `404 Not Found`, etc).
3.  **Capa de Servicios (`src/services/`)**: 
    Contiene la lógica de negocio. Es responsable de orquestar operaciones complejas, transformar/completar datos (por ejemplo, hashear una contraseña o mapear estados por defecto) y comunicarse con el Repositorio.
4.  **Capa de Repositorios (`src/repository/` y `src/utils/base.repository.js`)**: 
    Única responsable de la persistencia de datos (comunicación directa con PostgreSQL). 
    *   **BaseRepo** implementa operaciones CRUD genéricas, incluyendo búsquedas parametrizables de registros activos (`findActives`).
    *   **Repositorios de Entidad** extienden o usan la base pasándole la configuración específica de su tabla (nombre, columna ID y constantes de estado para altas/bajas lógicas).
5.  **Capa DTO (Data Transfer Object) (`src/dto/`)**: 
    Se utiliza para sanitizar y validar estrictamente los datos de entrada (cuerpos de POST y PUT). Retorna arrays con los errores detectados para frenar ejecuciones maliciosas o incompletas de forma temprana en el controlador.

---

## Entidades y Endpoints

La API cuenta con 4 entidades principales, todas respetan las normas BREAD (Browse, Read, Edit, Add, Delete) y hacen uso de **Bajas Lógicas** en lugar de eliminar datos permanentemente.

### 1. Estudiantes (`/api/estudiantes`)
*   `GET /api/estudiantes` - Obtiene lista de estudiantes (solo activos).
*   `GET /api/estudiantes/:id` - Detalle de un estudiante específico.
*   `POST /api/estudiantes` - Alta de estudiante.
*   `PUT /api/estudiantes/:id` - Modifica un estudiante (validado por DTO).
*   `DELETE /api/estudiantes/:id` - Baja lógica (`activo = 0`).

### 2. Usuarios (`/api/usuarios`)
*   `GET /api/usuarios` - Lista usuarios activos.
*   `GET /api/usuarios/:id` - Detalle de usuario.
*   `POST /api/usuarios` - Crea usuario (la contraseña viaja plana, se hashea en el Service).
*   `PUT /api/usuarios/:id` - Modifica usuario.
*   `DELETE /api/usuarios/:id` - Baja lógica (`activo = 0`).

### 3. Cursos (`/api/cursos`)
*   `GET /api/cursos` - Lista cursos activos (excluye cursos eliminados).
*   `GET /api/cursos/:id` - Detalle de curso.
*   `POST /api/cursos` - Crea nuevo curso (estado por defecto: 1 - BORRADOR).
*   `PUT /api/cursos/:id` - Modifica información del curso.
*   `DELETE /api/cursos/:id` - Baja lógica (cambia `id_curso_estado` a `4` - ELIMINADO).

### 4. Inscripciones (`/api/inscripciones`)
*   `GET /api/inscripciones` - Lista todas las inscripciones (excluye canceladas).
*   `GET /api/inscripciones/:id` - Detalle de la inscripción.
*   `POST /api/inscripciones` - Crea una inscripción.
*   `DELETE /api/inscripciones/:id` - Baja lógica (cambia `id_inscripcion_estado` a `2` - CANCELADA).
> **Nota:** La entidad Inscripciones NO posee endpoint `PUT`

---

## Cómo usar el proyecto (Entorno Dockerizado)

El entorno completo está empaquetado en contenedores de Docker, por lo que **no es necesario tener Node.js ni PostgreSQL instalados en tu máquina local**, solo necesitas tener Docker y Docker Compose activos.

### Pasos para iniciar

1. **Clonar e iniciar el entorno:**
   En la raíz del proyecto, ejecuta el siguiente comando en tu terminal para compilar las imágenes e iniciar todos los servicios:
   ```bash
   docker compose up --build
   ```
   *(La base de datos se inicializará automáticamente con la estructura y los datos semilla del archivo `init.sql`).*

2. **Acceder a la aplicación:**
   Una vez que la terminal indique que los servidores están listos, podrás acceder a ellos a través de los siguientes puertos:
   * **Frontend (Interfaz de Usuario)**: [http://localhost:8080](http://localhost:8080) (servido por Nginx).
   * **Backend (API REST)**: [http://localhost:3000/api](http://localhost:3000/api) (Express).
   * **Base de Datos (PostgreSQL)**: Puerto local `5432` (credenciales: `user: postgres`, `password: admin_db`, `database: fcad_cursos`).

---

## Autenticación y Seguridad (JWT)

El sistema implementa autenticación basada en **tokens JWT (JSON Web Tokens)**:

1. **Inicio de Sesión**:
   * Al ingresar credenciales correctas en la pantalla de login, el servidor firma un token de acceso seguro (válido por 2 horas).
   * El frontend recibe este token y lo guarda de forma persistente en el `localStorage` del navegador, junto con los datos básicos del usuario.
2. **Acceso Seguro a Rutas**:
   * Todas las solicitudes que realiza el frontend para consultar, crear, modificar o eliminar registros (cursos, estudiantes, inscripciones y usuarios) incluyen el token en la cabecera HTTP de autorización: `Authorization: Bearer <token>`.
   * Si intentas ingresar directamente a `main.html` sin haber iniciado sesión, el frontend detecta la ausencia del token y te redirige de inmediato a `index.html`.
3. **Cierre de Sesión**:
   * Al presionar "Cerrar Sesión", los datos de autenticación del `localStorage` son borrados, previniendo accesos no autorizados.

### Credenciales de Acceso
Todas las contraseñas de los usuarios son: Usuario.{id_usuario}.   
Ejemplo: **Usuario:** inovello, **Contraseña:** Usuario.5

---

## Pruebas de Endpoints (Bruno)

El proyecto incluye una carpeta `bruno_collection` la cual puedes importar en tu cliente REST [Bruno](https://www.usebruno.com/).
* Contiene las requests preconfiguradas con ejemplos en formato JSON para todas las entidades listas para hacer consultas a tu servidor local.
* **Autenticación en Bruno**: Para probar los endpoints protegidos, primero debes ejecutar la petición de la carpeta raíz **`Login`** para obtener el token, luego ve a la pestaña **Auth** de la consulta que desees probar, selecciona **Bearer Token** y pega el token JWT obtenido.

