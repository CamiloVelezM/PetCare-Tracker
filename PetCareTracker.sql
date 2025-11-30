CREATE DATABASE PetCareTracker;
Use PetCareTracker;

-- Tabla de usuarios que registran mascotas
CREATE TABLE Usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único del usuario
  nombre VARCHAR(100),                      -- Nombre del usuario
  correo VARCHAR(100),                      -- Correo electrónico
  telefono VARCHAR(20)                      -- Teléfono de contacto
);

-- Tabla de mascotas registradas por los usuarios
CREATE TABLE Mascota (
  id_mascota INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único de la mascota
  nombre VARCHAR(100),                       -- Nombre de la mascota
  especie VARCHAR(50),                       -- Especie (ej. perro, gato)
  raza VARCHAR(50),                          -- Raza de la mascota
  edad INT,                                  -- Edad en años
  peso DECIMAL(5,2),                         -- Peso en kilogramos
  condicion VARCHAR(100),                    -- Condición de salud (ej. alérgico, diabético)
  id_usuario INT,                            -- Relación con el dueño (usuario)
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) -- Clave foránea
);

-- Tabla de vacunas aplicadas a cada mascota
CREATE TABLE Vacuna (
  id_vacuna INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único de la vacuna
  nombre VARCHAR(100),                      -- Nombre de la vacuna (ej. rabia, parvovirus)
  fecha_aplicacion DATE,                    -- Fecha en que se aplicó la vacuna
  id_mascota INT,                           -- Relación con la mascota
  FOREIGN KEY (id_mascota) REFERENCES Mascota(id_mascota) -- Clave foránea
);

-- Tabla de cuidados realizados a cada mascota
CREATE TABLE Cuidado (
  id_cuidado INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único del cuidado
  tipo VARCHAR(50),                          -- Tipo de cuidado (ej. baño, desparasitación)
  descripcion TEXT,                          -- Detalles del cuidado realizado
  fecha DATE,                                -- Fecha del cuidado
  id_mascota INT,                            -- Relación con la mascota
  FOREIGN KEY (id_mascota) REFERENCES Mascota(id_mascota) -- Clave foránea
);

-- Tabla de recomendaciones según edad y raza
CREATE TABLE Recomendacion (
  id_recomendacion INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único de la recomendación
  edad_min INT,                                    -- Edad mínima para aplicar la recomendación
  edad_max INT,                                    -- Edad máxima
  raza VARCHAR(50),                                -- Raza objetivo
  texto TEXT                                       -- Texto con la recomendación
);

-- INSERCION DE DATOS SINTETICOS (INSERT)

-- Usuarios de prueba
INSERT INTO Usuario (nombre, correo, telefono) VALUES
('Camilo Vélez', 'camilo@example.com', '3001234567'),
('Andres Torres', 'Andres@example.com', '3019876543'),
('Carlos Gómez', 'carlos@example.com', '3025551122');

-- Mascotas de prueba
INSERT INTO Mascota (nombre, especie, raza, edad, peso, condicion, id_usuario) VALUES
('Chispas', 'Perro', 'Labrador', 3, 24.50, 'Sano', 1),
('Rose', 'Gato', 'Siames', 2, 4.20, 'Alérgico', 1),
('Rocky', 'Perro', 'Bulldog', 5, 18.30, 'Diabético', 2),
('Violeta', 'Perro', 'Criollo', 1, 8.10, 'Sana', 3);

-- Vacunas de prueba
INSERT INTO Vacuna (nombre, fecha_aplicacion, id_mascota) VALUES
('Rabia', '2024-01-10', 1),
('Parvovirus', '2024-02-15', 1),
('Triple Felina', '2024-03-01', 2),
('Rabia', '2023-11-20', 3);

-- Cuidados de prueba
INSERT INTO Cuidado (tipo, descripcion, fecha, id_mascota) VALUES
('Baño', 'Baño con shampoo hipoalergénico', '2024-04-01', 1),
('Desparasitación', 'Desparasitación interna', '2024-04-10', 1),
('Baño', 'Baño general', '2024-04-05', 2),
('Control', 'Control por condición diabética', '2024-02-20', 3),
('Vacunación', 'Revisión post vacuna', '2024-03-05', 2);

-- Recomendaciones de prueba
INSERT INTO Recomendacion (edad_min, edad_max, raza, texto) VALUES
(0, 1, 'Labrador', 'Aplicar esquema completo de vacunación y desparasitación mensual.'),
(2, 5, 'Labrador', 'Mantener actividad física diaria y controlar el peso.'),
(0, 3, 'Siames', 'Revisar alergias y usar alimento hipoalergénico.'),
(4, 10, 'Bulldog', 'Controlar peso y revisar posibles problemas respiratorios.');



-- ======================================================================================
-- PREGUNTA 1:
-- ¿Cuántas mascotas tiene cada usuario?
-- Descripción:
-- Se requiere conocer cuántas mascotas ha registrado cada usuario dentro del sistema.
-- Esta consulta usa LEFT JOIN para incluir también usuarios sin mascotas.
-- ======================================================================================

SELECT 
    u.id_usuario,
    u.nombre AS nombre_usuario,
    COUNT(m.id_mascota) AS cantidad_mascotas
FROM Usuario u
LEFT JOIN Mascota m ON u.id_usuario = m.id_usuario
GROUP BY u.id_usuario, u.nombre;


-- ======================================================================================
-- PREGUNTA 2:
-- ¿Qué mascotas no tienen ninguna vacuna registrada?
-- Descripción:
-- Se necesita identificar las mascotas que aún no tienen registros en la tabla Vacuna.
-- Se usa LEFT JOIN y se selecciona cuando la clave de vacuna es NULL.
-- ======================================================================================

SELECT 
    m.id_mascota,
    m.nombre AS nombre_mascota,
    m.especie,
    u.nombre AS nombre_dueno
FROM Mascota m
JOIN Usuario u ON m.id_usuario = u.id_usuario
LEFT JOIN Vacuna v ON m.id_mascota = v.id_mascota
WHERE v.id_vacuna IS NULL;


-- ======================================================================================
-- PREGUNTA 3:
-- ¿Qué vacunas se han aplicado a cada mascota y en qué fechas?
-- Descripción:
-- Se deben listar todas las vacunas registradas junto con la mascota a la que pertenecen.
-- ======================================================================================

SELECT
    m.nombre AS nombre_mascota,
    m.especie,
    v.nombre AS vacuna,
    v.fecha_aplicacion
FROM Mascota m
JOIN Vacuna v ON m.id_mascota = v.id_mascota
ORDER BY m.nombre, v.fecha_aplicacion;


-- ======================================================================================
-- PREGUNTA 4:
-- ¿Cuántos cuidados se le han realizado a cada mascota?
-- Descripción:
-- Consulta para contar los cuidados registrados en la tabla Cuidado por mascota.
-- ======================================================================================

SELECT
    m.id_mascota,
    m.nombre AS nombre_mascota,
    COUNT(c.id_cuidado) AS cantidad_cuidados
FROM Mascota m
LEFT JOIN Cuidado c ON m.id_mascota = c.id_mascota
GROUP BY m.id_mascota, m.nombre
ORDER BY cantidad_cuidados DESC;


-- ======================================================================================
-- PREGUNTA 5:
-- ¿Qué recomendaciones aplican para cada mascota según su edad y raza?
-- Descripción:
-- Se comparan los rangos de edad y la raza de cada mascota con la tabla Recomendacion.
-- ======================================================================================

SELECT
    m.id_mascota,
    m.nombre AS nombre_mascota,
    m.edad,
    m.raza,
    r.texto AS recomendacion
FROM Mascota m
JOIN Recomendacion r 
    ON m.raza = r.raza
   AND m.edad BETWEEN r.edad_min AND r.edad_max
ORDER BY m.nombre;

