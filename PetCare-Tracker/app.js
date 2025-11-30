// ============================================================
// 🐶 PetCare Tracker - Backend (Node + Express)
// Archivo principal del servidor
// ============================================================

// ------------------------------------------------------------
// 1️⃣ IMPORTACIONES PRINCIPALES
// ------------------------------------------------------------
const express = require('express');
const cors = require('cors');
const app = express();

// Puerto donde correrá el backend (React usa 3000 → evitamos conflicto)
const PORT = 4000;


// ------------------------------------------------------------
// 2️⃣ MIDDLEWARES (Capa que procesa antes de llegar a las rutas)
// ------------------------------------------------------------

// Permite recibir datos JSON en las peticiones (POST, PUT)
app.use(express.json());

// Permite que el frontend (React) pueda conectarse al backend
app.use(cors());


// ------------------------------------------------------------
// 3️⃣ RUTAS PRINCIPALES DEL PROYECTO
// Cada módulo maneja sus propias rutas y lógica
// ------------------------------------------------------------

// 📌 Mascotas
const mascotasRoutes = require('./routes/mascotas');
app.use('/mascotas', mascotasRoutes);

// 📌 Usuarios (dueños)
const usuariosRoutes = require('./routes/usuarios');
app.use('/usuarios', usuariosRoutes);

// 📌 Vacunas (opcional)
const vacunasRoutes = require('./routes/vacunas');
app.use('/vacunas', vacunasRoutes);

// 📌 Cuidados (opcional)
const cuidadosRoutes = require('./routes/cuidados');
app.use('/cuidados', cuidadosRoutes);


// ------------------------------------------------------------
// 4️⃣ RUTA DE PRUEBA (para verificar conexión sin frontend)
// ------------------------------------------------------------
app.get('/', (req, res) => {
  res.send('API PetCareTracker funcionando 🐾');
});


// ------------------------------------------------------------
// 5️⃣ INICIO DEL SERVIDOR
// ------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});