-- Agregar campo estado a la tabla facturas para implementar soft delete
-- Ejecutar este script en la base de datos MySQL

ALTER TABLE facturas ADD COLUMN estado VARCHAR(20) DEFAULT 'activa' AFTER metodo_pago;

-- Actualizar facturas existentes para que tengan estado 'activa'
UPDATE facturas SET estado = 'activa' WHERE estado IS NULL;

-- Agregar índice para mejorar consultas por estado
CREATE INDEX idx_facturas_estado ON facturas(estado);
