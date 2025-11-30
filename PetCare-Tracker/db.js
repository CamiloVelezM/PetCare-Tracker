// db.js
const mysql = require('mysql2'); // Importamos el paquete mysql2

// Creamos la conexión con la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',       // Dirección del servidor MySQL 
  port: 3306,              // Puerto por defecto de MySQL
  user: 'root',            // Usuario de MySQL 
  password: 'casmilo98',            // Contraseña del usuario 
  database: 'PetCareTracker'   // Nombre de tu base de datos (debe existir en MySQL)
});

                                    // Verificamos si la conexión fue exitosa
connection.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err); // Se muestra  el error si falla
    return;
  }
  console.log('✅ Conexión exitosa a MySQL'); // Se confirma que se conectó bien
});

// Exportamos la conexión para usarla en otros archivos
module.exports = connection;