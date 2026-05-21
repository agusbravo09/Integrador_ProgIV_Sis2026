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

## Cómo usar el proyecto (Entorno de Desarrollo)

### Requisitos
*   Node.js instalado localmente.
*   Docker y Docker Compose (para levantar la base de datos PostgreSQL).
*   Python instalado (para levantar el servidor local del frontend).

### Pasos de Instalación y Ejecución

**1. Levantar Base de Datos:**
En la raíz del proyecto ejecutar:
```bash
docker-compose up -d
