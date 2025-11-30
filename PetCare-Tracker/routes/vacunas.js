// ============================================================
// 🐾 routes/vacunas.js
// Rutas para manejar las VACUNAS de las mascotas
// ============================================================

// ------------------------------------------------------------
// 1️⃣ IMPORTACIONES Y CONFIGURACIÓN DEL ROUTER
// ------------------------------------------------------------
const express = require('express');
const router = express.Router();

// Conexión a la base de datos MySQL
const db = require('../db');


// ------------------------------------------------------------
// 2️⃣ CREAR UNA NUEVA VACUNA (POST /vacunas)
// ------------------------------------------------------------
/*
  Ejemplo de JSON esperado:

  {
    "nombre": "Rabia",
    "fecha_aplicacion": "2025-11-30",
    "id_mascota": 1
  }

  - nombre             ✅ obligatorio
  - fecha_aplicacion   ✅ obligatorio
  - id_mascota         ✅ obligatorio
*/
router.post('/', (req, res) => {
  const { nombre, fecha_aplicacion, id_mascota } = req.body;

  // Validación básica de campos obligatorios
  if (!nombre || !fecha_aplicacion || !id_mascota) {
    return res.status(400).json({
      mensaje: 'nombre, fecha_aplicacion e id_mascota son obligatorios',
    });
  }

  const sql = `
    INSERT INTO Vacuna (nombre, fecha_aplicacion, id_mascota)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [nombre, fecha_aplicacion, id_mascota], (err, result) => {
    if (err) {
      console.error('❌ Error al crear vacuna:', err);
      return res.status(500).json({ error: err });
    }

    res.status(201).json({
      mensaje: 'Vacuna registrada correctamente',
      id_vacuna: result.insertId,
    });
  });
});


// ------------------------------------------------------------
// 3️⃣ OBTENER TODAS LAS VACUNAS DE UNA MASCOTA
//     GET /vacunas/mascota/:id_mascota
// ------------------------------------------------------------
/*
  Ejemplo:
    GET /vacunas/mascota/3

  Devuelve todas las vacunas aplicadas a esa mascota.
*/
router.get('/mascota/:id_mascota', (req, res) => {
  const { id_mascota } = req.params;

  const sql = `
    SELECT id_vacuna, nombre, fecha_aplicacion
    FROM Vacuna
    WHERE id_mascota = ?
    ORDER BY fecha_aplicacion DESC
  `;

  db.query(sql, [id_mascota], (err, rows) => {
    if (err) {
      console.error('❌ Error al obtener vacunas:', err);
      return res.status(500).json({ error: err });
    }

    // "rows" contiene un arreglo de vacunas
    res.json(rows);
  });
});


// ------------------------------------------------------------
// 4️⃣ ACTUALIZAR UNA VACUNA
//     PUT /vacunas/:id_vacuna
// ------------------------------------------------------------
/*
  Ejemplo:
    PUT /vacunas/5

  Body esperado:
  {
    "nombre": "Parvovirus",
    "fecha_aplicacion": "2025-10-15"
  }
*/
router.put('/:id_vacuna', (req, res) => {
  const { id_vacuna } = req.params;
  const { nombre, fecha_aplicacion } = req.body;

  // Validación mínima
  if (!nombre || !fecha_aplicacion) {
    return res.status(400).json({
      mensaje: 'nombre y fecha_aplicacion son obligatorios',
    });
  }

  const sql = `
    UPDATE Vacuna
    SET nombre = ?, fecha_aplicacion = ?
    WHERE id_vacuna = ?
  `;

  db.query(sql, [nombre, fecha_aplicacion, id_vacuna], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar vacuna:', err);
      return res.status(500).json({ error: err });
    }

    // Si no se actualizó ninguna fila → no existe el registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Vacuna no encontrada' });
    }

    res.json({ mensaje: 'Vacuna actualizada correctamente' });
  });
});


// ------------------------------------------------------------
// 5️⃣ ELIMINAR UNA VACUNA
//     DELETE /vacunas/:id_vacuna
// ------------------------------------------------------------
/*
  Ejemplo:
    DELETE /vacunas/10

  Elimina la vacuna con id_vacuna = 10
*/
router.delete('/:id_vacuna', (req, res) => {
  const { id_vacuna } = req.params;

  const sql = `DELETE FROM Vacuna WHERE id_vacuna = ?`;

  db.query(sql, [id_vacuna], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar vacuna:', err);
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Vacuna no encontrada' });
    }

    res.json({ mensaje: 'Vacuna eliminada correctamente' });
  });
});


// ------------------------------------------------------------
// 6️⃣ EXPORTAR ROUTER
// ------------------------------------------------------------
module.exports = router;