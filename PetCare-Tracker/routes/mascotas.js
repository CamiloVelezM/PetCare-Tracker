// routes/mascotas.js

// --------------------------------------------------------------
// 1️⃣ IMPORTACIONES Y CONFIGURACIÓN DEL ROUTER
// --------------------------------------------------------------

// Importamos Express para poder crear rutas HTTP (GET, POST, PUT, DELETE, etc.)
const express = require('express');

// Creamos un router específico para las rutas de MASCOTAS.
// Este "router" es como un mini-servidor que agrupa solo las rutas relacionadas con mascotas.
const router = express.Router();

// Importamos la conexión a la base de datos desde db.js.
// Con este objeto `db` podremos ejecutar consultas SQL (SELECT, INSERT, UPDATE, DELETE).
const db = require('../db');


// --------------------------------------------------------------
// 2️⃣ RUTA: CREAR UNA NUEVA MASCOTA (POST /mascotas)
// --------------------------------------------------------------

// Esta ruta se usa para REGISTRAR una nueva mascota en la base de datos.
// Se espera que el frontend envíe los datos en formato JSON en el body de la petición.
router.post('/', (req, res) => {
  // Desestructuramos los campos que esperamos recibir desde el frontend.
  // Ejemplo de body:
  // {
  //   "nombre": "Firulais",
  //   "especie": "Perro",
  //   "raza": "Labrador",
  //   "edad": 3,
  //   "peso": 20.5,
  //   "condicion": "Sano",
  //   "id_usuario": 1
  // }
  const { nombre, especie, raza, edad, peso, condicion, id_usuario } = req.body;

  // Validación básica (opcional): verificar que al menos nombre y especie vengan llenos.
  if (!nombre || !especie) {
    return res.status(400).json({
      mensaje: 'Faltan datos obligatorios: nombre y especie son requeridos.',
    });
  }

  // Definimos la consulta SQL para insertar una nueva mascota.
  // Los ? son marcadores de posición que luego serán reemplazados por los valores del array.
  const sql = `
    INSERT INTO Mascota (nombre, especie, raza, edad, peso, condicion, id_usuario)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // Ejecutamos la consulta SQL.
  db.query(
    sql,
    [nombre, especie, raza, edad, peso, condicion, id_usuario],
    (err, result) => {
      // Si ocurre un error en la base de datos, respondemos con código 500 (error del servidor).
     if (err) {
        console.error('❌ Error al crear mascota:', err); // sigue logueando
        return res.status(500).json({
           mensaje: 'Error al crear mascota',
          detalle: err.sqlMessage || err.message || err
      });
}

      // Si todo sale bien, `result.insertId` contiene el ID de la nueva mascota.
      res.status(201).json({
        mensaje: 'Mascota creada correctamente',
        id_mascota: result.insertId,
      });
    }
  );
});


// --------------------------------------------------------------
// 3️⃣ RUTA: OBTENER TODAS LAS MASCOTAS (GET /mascotas)
// --------------------------------------------------------------

// Esta ruta se usa para LISTAR todas las mascotas registradas en la base de datos.
router.get('/', (req, res) => {
  // Consulta SQL simple para traer todos los registros de la tabla Mascota.
  const sql = 'SELECT * FROM Mascota';

  db.query(sql, (err, rows) => {
    // Si hay un error en la consulta, respondemos con error 500.
    if (err) {
      console.error('❌ Error al obtener mascotas:', err);
      return res.status(500).json({ error: err });
    }

    // `rows` es un arreglo con todas las mascotas.
    res.json(rows);
  });
});


// --------------------------------------------------------------
// 4️⃣ RUTA: OBTENER UNA MASCOTA POR ID (GET /mascotas/:id)
// --------------------------------------------------------------

// Esta ruta se usa para obtener una mascota específica por su ID.
// Ejemplo: GET /mascotas/3 → devuelve la mascota cuyo id_mascota sea 3.
router.get('/:id', (req, res) => {
  // Obtenemos el id de la mascota desde los parámetros de la URL.
  const id = req.params.id;

  const sql = 'SELECT * FROM Mascota WHERE id_mascota = ?';

  db.query(sql, [id], (err, rows) => {
    if (err) {
      console.error('❌ Error al obtener mascota:', err);
      return res.status(500).json({ error: err });
    }

    // Si no encontramos ninguna mascota con ese id, devolvemos 404 (no encontrado).
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Mascota no encontrada' });
    }

    // Devolvemos solo la primera coincidencia (debería haber máximo 1).
    res.json(rows[0]);
  });
});


// --------------------------------------------------------------
// 5️⃣ RUTA: ACTUALIZAR UNA MASCOTA (PUT /mascotas/:id)
// --------------------------------------------------------------

// Esta ruta se usa para EDITAR la información de una mascota existente.
router.put('/:id', (req, res) => {
  const id = req.params.id;

  // Obtenemos los datos que se quieren actualizar desde el body.
  const { nombre, especie, raza, edad, peso, condicion } = req.body;

  const sql = `
    UPDATE Mascota 
    SET nombre = ?, especie = ?, raza = ?, edad = ?, peso = ?, condicion = ?
    WHERE id_mascota = ?
  `;

  db.query(sql, [nombre, especie, raza, edad, peso, condicion, id], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar mascota:', err);
      return res.status(500).json({ error: err });
    }

    // Si no se afectó ninguna fila, significa que no existe la mascota con ese id.
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Mascota no encontrada' });
    }

    res.json({ mensaje: 'Mascota actualizada correctamente' });
  });
});


// --------------------------------------------------------------
// 6️⃣ RUTA: ELIMINAR UNA MASCOTA (DELETE /mascotas/:id)
// --------------------------------------------------------------

// Esta ruta se usa para ELIMINAR una mascota de la base de datos.
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM Mascota WHERE id_mascota = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar mascota:', err);
      return res.status(500).json({ error: err });
    }

    // Si no se eliminó ninguna fila, significa que no existe ese id.
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Mascota no encontrada' });
    }

    res.json({ mensaje: 'Mascota eliminada correctamente' });
  });
});


// --------------------------------------------------------------
// 7️⃣ EXPORTAMOS EL ROUTER
// --------------------------------------------------------------

// Exportamos este router para que pueda ser usado en app.js con:
//   const mascotasRoutes = require('./routes/mascotas');
//   app.use('/mascotas', mascotasRoutes);
module.exports = router;