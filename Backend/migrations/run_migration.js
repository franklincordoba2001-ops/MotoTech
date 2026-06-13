import db from '../src/config/db.js';

async function runMigration() {
  try {
    const connection = await db.getConnection();
    console.log('Conectado a la base de datos...');

    // Agregar campo estado
    await connection.query(`
      ALTER TABLE facturas 
      ADD COLUMN estado VARCHAR(20) DEFAULT 'activa' AFTER metodo_pago
    `);
    console.log('✅ Campo estado agregado a la tabla facturas');

    // Actualizar facturas existentes
    await connection.query(`
      UPDATE facturas SET estado = 'activa' WHERE estado IS NULL
    `);
    console.log('✅ Facturas existentes actualizadas con estado activa');

    // Crear índice
    await connection.query(`
      CREATE INDEX idx_facturas_estado ON facturas(estado)
    `);
    console.log('✅ Índice idx_facturas_estado creado');

    connection.release();
    console.log('✅ Migración completada exitosamente');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠️ El campo estado ya existe en la tabla facturas');
      process.exit(0);
    }
    console.error('❌ Error en la migración:', error.message);
    process.exit(1);
  }
}

runMigration();
