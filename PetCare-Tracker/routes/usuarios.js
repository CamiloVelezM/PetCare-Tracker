// Importamos Express para crear rutas
const express = require('express');

// Creamos un router específico para usuarios
const router = express.Router();

// Importamos la conexión a la base de datos desde db.js
const db = require('../db');


// 🟢 Ruta para crear un nuevo usuario
router.post('/', (req, res) => {
  // Extraemos los datos enviados en el cuerpo de la petición
  const { nombre, correo, telefono } = req.body;

  // Consulta SQL para insertar un nuevo usuario
  const sql = 'INSERT INTO Usuario (nombre, correo, telefono) VALUES (?, ?, ?)';

  // Ejecutamos la consulta con los valores recibidos
  db.query(sql, [nombre, correo, telefono], (err, result) => {
    if (err) {
      // Si hay error, lo enviamos como respuesta
      return res.status(500).json({ error: err });
    }

    // Si todo sale bien, respondemos con el ID del nuevo usuario
    res.json({ mensaje: 'Usuario creado', id: result.insertId });
  });
});


// 🔵 Ruta para obtener todos los usuarios
router.get('/', (req, res) => {
  // Consulta SQL para obtener todos los registros de la tabla Usuario
  db.query('SELECT * FROM Usuario', (err, rows) => {
    if (err) {
      // Si hay error, lo enviamos como respuesta
      return res.status(500).json({ error: err });
    }

    // Enviamos todos los usuarios como respuesta en formato JSON
    res.json(rows);
  });
});


// Exportamos el router para que pueda usarse en app.js
module.exports = router;