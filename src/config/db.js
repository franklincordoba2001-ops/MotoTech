const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mototech'
});
// Bloque de prueba de conexión
(async () => {
    try {
        const conn = await connection.getConnection();
        console.log(' Conectado  base de datos "mototech" exitosamente.');
        conn.release(); // Importante: libera la conexión de vuelta al pool
    } catch (error) {
        console.error(' Error al conectar a la base de datos:', error.message);
    }
})();


module.exports = connection;
