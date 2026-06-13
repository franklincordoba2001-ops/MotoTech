import db from '../src/config/db.js';

async function createRepuestosSchema() {
  try {
    const connection = await db.getConnection();
    console.log('Conectando a la base de datos para crear el esquema de repuestos...');

    // 1. Crear tabla de repuestos (inventario)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS repuestos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        precio_venta DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        stock INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✅ Tabla "repuestos" validada/creada');

    // 2. Crear tabla intermedia para asociar repuestos a las órdenes
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orden_repuestos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orden_id INT NOT NULL,
        repuesto_id INT NOT NULL,
        cantidad INT NOT NULL DEFAULT 1,
        precio_unitario DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (orden_id) REFERENCES ordenes_servicio(id) ON DELETE CASCADE,
        FOREIGN KEY (repuesto_id) REFERENCES repuestos(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('✅ Tabla "orden_repuestos" validada/creada');

    // 3. Insertar datos semilla (repuestos básicos) si la tabla está vacía
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM repuestos');
    if (rows[0].count === 0) {
      const repuestosSemilla = [
        ['Aceite 10W40 Semisintético 1L', 35000.00, 50],
        ['Pastillas de Freno Delanteras', 25000.00, 30],
        ['Bujía de Iridium NGK', 18000.00, 100],
        ['Kit de Arrastre (Cadena + Piñones)', 120000.00, 15],
        ['Filtro de Aceite original', 15000.00, 40],
        ['Batería Gel 12V', 95000.00, 10]
      ];

      for (const repuesto of repuestosSemilla) {
        await connection.query(
          'INSERT INTO repuestos (nombre, precio_venta, stock) VALUES (?, ?, ?)',
          repuesto
        );
      }
      console.log('✅ Datos de prueba insertados en "repuestos"');
    } else {
      console.log('⚠️ La tabla "repuestos" ya contiene datos, omitiendo inserción de semilla.');
    }

    connection.release();
    console.log('🎉 Migración de esquema de repuestos completada exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear el esquema de repuestos:', error.message);
    process.exit(1);
  }
}

createRepuestosSchema();
