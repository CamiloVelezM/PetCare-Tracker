PETCARE TRACKER
Andres Camilo Velez Moncada
202020074
Lenguaje de Programacion para la Web y Bases de Datos
Sistema de gestión para clientes, mascotas, vacunas y cuidados

Descripción general
PetCare Tracker es una aplicación web completa diseñada para administrar usuarios (dueños), mascotas, vacunas y cuidados veterinarios.
Es un proyecto académico que integra Lenguaje de Programación para la Web con Bases de Datos, logrando un sistema CRUD funcional con frontend, backend y base de datos MySQL.

⸻

FUNCIONALIDADES PRINCIPALES
	1.	Gestión de Usuarios

	•	Crear usuarios (dueños)
	•	Editar usuarios
	•	Eliminar usuarios
	•	Consultar historial de usuarios

	2.	Gestión de Mascotas

	•	Registrar mascotas asociadas a un usuario
	•	Editar mascotas
	•	Eliminar mascotas
	•	Consultar historial de mascotas

	3.	Gestión de Vacunas

	•	Registrar vacunas
	•	Editar vacunas
	•	Eliminar vacunas
	•	Listar vacunas por mascota

	4.	Gestión de Cuidados

	•	Registrar cuidados (baño, control, desparasitación, etc.)
	•	Editar cuidados
	•	Eliminar cuidados
	•	Listar cuidados por mascota

	5.	Pantalla principal moderna

	•	Menú con tarjetas interactivas
	•	Imagen ilustrativa temática
	•	Diseño limpio y responsivo

⸻

CONEXIÓN CON LA BASE DE DATOS (PROYECTO DE BASES DE DATOS)

Este proyecto está conectado a una base de datos MySQL diseñada con relaciones y llaves foráneas.

TABLAS IMPLEMENTADAS:

Tabla Usuario
	•	id_usuario (INT, PK)
	•	nombre
	•	correo
	•	telefono

Tabla Mascota
	•	id_mascota (INT, PK)
	•	nombre
	•	especie
	•	raza
	•	edad
	•	peso
	•	condicion
	•	id_usuario (FK → Usuario.id_usuario)

Tabla Vacuna
	•	id_vacuna (INT, PK)
	•	nombre
	•	fecha_aplicacion
	•	id_mascota (FK)

Tabla Cuidado
	•	id_cuidado (INT, PK)
	•	tipo
	•	descripcion
	•	fecha
	•	id_mascota (FK)

Todas las operaciones se realizan con rutas REST (POST, GET, PUT, DELETE).

⸻

TECNOLOGÍAS UTILIZADAS

FRONTEND (React):
	•	React.js
	•	Componentes organizados:
FormularioUsuario.js
FormularioMascota.js
ListaUsuarios.js
ListaMascotas.js
DetallesMascota.js
	•	App.css con diseño moderno
	•	Responsivo para PC, tablet y celular

BACKEND (Node.js + Express):
	•	Express
	•	Rutas separadas por módulo:
/usuarios
/mascotas
/vacunas
/cuidados
	•	Conexión a MySQL con mysql2

BASE DE DATOS:
	•	MySQL
	•	Relaciones 1:N
	•	CRUD completo

⸻

CÓMO EJECUTAR EL PROYECTO
	1.	Clonar el repositorio
git clone https://github.com/CamiloVelezM/PetCare-Tracker.git
cd PetCare-Tracker
	2.	Ejecutar el backend
cd PetCare-Tracker
npm install
node app.js

Backend disponible en:
http://localhost:4000
	3.	Ejecutar el frontend
cd petcare-frontend
npm install
npm start

Frontend disponible en:
http://localhost:3000

Nota: El backend debe estar ejecutándose antes de abrir el frontend.

⸻

📦 IMPORTAR BASE DE DATOS

En MySQL Workbench o terminal:

1. Abrir MySQL
2. Ejecutar:
   SOURCE PetCareTracker.sql;

La base de datos quedará creada automáticamente con tablas y datos de prueba.

DISEÑO RESPONSIVO

El proyecto se adapta automáticamente a:
	•	Computadores
	•	Tablets
	•	Teléfonos móviles

⸻


ESTADO DEL PROYECTO

Proyecto finalizado con:
	•	CRUD completo
	•	Conexión MySQL
	•	Frontend React
	•	Backend Node + Express
	•	Diseño UI moderno
	•	Responsivo
	•	Semántica en el código
	•	Comentarios explicativos
