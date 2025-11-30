// ============================================================
// 🐾 routes/cuidados.js
// Rutas para manejar los cuidados de las mascotas
// ============================================================

// ------------------------------------------------------------
// 1️⃣ IMPORTACIONES Y CONFIGURACIÓN DEL ROUTER
// ------------------------------------------------------------
const express = require('express');
const router = express.Router();

// Conexión a la base de datos MySQL
const db = require('../db');


// ------------------------------------------------------------
// 2️⃣ CREAR UN NUEVO CUIDADO (POST /cuidados)
// ------------------------------------------------------------
/*
  Ejemplo de JSON que espera esta ruta:

  {
    "tipo": "Baño",
    "descripcion": "Baño medicado para piel sensible",
    "fecha": "2025-11-30",
    "id_mascota": 1
  }

  - tipo       ✅ (obligatorio)
  - fecha      ✅ (obligatorio)
  - id_mascota ✅ (obligatorio)
  - descripcion (opcional)
*/
router.post('/', (req, res) => {
  const { tipo, descripcion, fecha, id_mascota } = req.body;

  // Validación básica de campos obligatorios
  if (!tipo || !fecha || !id_mascota) {
    return res.status(400).json({
      mensaje: 'tipo, fecha e id_mascota son obligatorios',
    });
  }

  // Consulta SQL para insertar el nuevo cuidado
  const sql = `
    INSERT INTO Cuidado (tipo, descripcion, fecha, id_mascota)
    VALUES (?, ?, ?, ?)
  `;

  // descripcion || null → si no viene, guardamos NULL en la BD
  db.query(sql, [tipo, descripcion || null, fecha, id_mascota], (err, result) => {
    if (err) {
      console.error('❌ Error al crear cuidado:', err);
      return res.status(500).json({ error: err });
    }

    // result.insertId trae el id_cuidado generado
    res.status(201).json({
      mensaje: 'Cuidado registrado correctamente',
      id_cuidado: result.insertId,
    });
  });
});


// ------------------------------------------------------------
// 3️⃣ OBTENER CUIDADOS DE UNA MASCOTA
//     GET /cuidados/mascota/:id_mascota
// ------------------------------------------------------------
/*
  Ejemplo:
    GET /cuidados/mascota/1

  Devuelve todos los cuidados de la mascota con id_mascota = 1
  ordenados desde el más reciente al más antiguo.
*/
router.get('/mascota/:id_mascota', (req, res) => {
  const { id_mascota } = req.params;

  const sql = `
    SELECT id_cuidado, tipo, descripcion, fecha
    FROM Cuidado
    WHERE id_mascota = ?
    ORDER BY fecha DESC
  `;

  db.query(sql, [id_mascota], (err, rows) => {
    if (err) {
      console.error('❌ Error al obtener cuidados:', err);
      return res.status(500).json({ error: err });
    }

    // rows es un arreglo con todos los cuidados encontrados
    res.json(rows);
  });
});


// ------------------------------------------------------------
// 4️⃣ ACTUALIZAR UN CUIDADO
//     PUT /cuidados/:id_cuidado
// ------------------------------------------------------------
/*
  Ejemplo:
    PUT /cuidados/5

  Body esperado:
  {
    "tipo": "Control",
    "descripcion": "Control de peso y revisión general",
    "fecha": "2025-11-30"
  }

  - tipo  ✅ obligatorio
  - fecha ✅ obligatorio
*/
router.put('/:id_cuidado', (req, res) => {
  const { id_cuidado } = req.params;
  const { tipo, descripcion, fecha } = req.body;

  // Validación de campos obligatorios
  if (!tipo || !fecha) {
    return res.status(400).json({
      mensaje: 'tipo y fecha son obligatorios',
    });
  }

  const sql = `
    UPDATE Cuidado
    SET tipo = ?, descripcion = ?, fecha = ?
    WHERE id_cuidado = ?
  `;

  db.query(sql, [tipo, descripcion || null, fecha, id_cuidado], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar cuidado:', err);
      return res.status(500).json({ error: err });
    }

    // affectedRows = 0 → no existe un cuidado con ese id
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Cuidado no encontrado' });
    }

    res.json({ mensaje: 'Cuidado actualizado correctamente' });
  });
});


// ------------------------------------------------------------
// 5️⃣ ELIMINAR UN CUIDADO
//     DELETE /cuidados/:id_cuidado
// ------------------------------------------------------------
/*
  Ejemplo:
    DELETE /cuidados/5

  Elimina el cuidado con id_cuidado = 5
*/
router.delete('/:id_cuidado', (req, res) => {
  const { id_cuidado } = req.params;

  const sql = `DELETE FROM Cuidado WHERE id_cuidado = ?`;

  db.query(sql, [id_cuidado], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar cuidado:', err);
      return res.status(500).json({ error: err });
    }

    // Si no se eliminó ninguna fila, no se encontró ese cuidado
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Cuidado no encontrado' });
    }

    res.json({ mensaje: 'Cuidado eliminado correctamente' });
  });
});


// ------------------------------------------------------------
// 6️⃣ EXPORTAR ROUTER
// ------------------------------------------------------------
module.exports = router;