import mysql from 'mysql2/promise';

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mototech'
});


(async () => {
    try {
        const conn = await connection.getConnection();
        console.log('✅ Conectado a la base de datos "mototech" exitosamente.');
        conn.release();
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error.message);
    }
})();


export default connection;
