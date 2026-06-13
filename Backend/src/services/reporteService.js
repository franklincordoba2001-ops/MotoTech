// CAMBIO: Usamos import y agregamos el .js
import db from '../config/db.js';

const reporteService = {
    
    save: async (data) => {
        const { orden_id, total, metodo_pago } = data;
        
        if (total < 0) throw new Error("El total del reporte no puede ser negativo");

        const sql = "INSERT INTO facturas (orden_id, fecha, total, metodo_pago) VALUES (?, NOW(), ?, ?)";
        const [result] = await db.query(sql, [orden_id, total, metodo_pago]);
        return result;
    },

    listAll: async () => {
        const [rows] = await db.query("SELECT * FROM facturas");
        return rows;
    },

    listById: async (id) => {
        const [rows] = await db.query("SELECT * FROM facturas WHERE id = ?", [id]);
        return rows[0];
    },

    update: async (id, data) => {
        const { total } = data;
        const sql = "UPDATE facturas SET total = ? WHERE id = ?";
        const [result] = await db.query(sql, [total, id]);
        return result;
    },

    delete: async (id) => {
        const [result] = await db.query("DELETE FROM facturas WHERE id = ?", [id]);
        return result;
    },

    /**
     * SUPERADMIN: Obtiene reporte financiero completo
     */
    obtenerReportFinanciero: async () => {
        try {
            const [rows] = await db.query(`
                SELECT 
                    IFNULL(SUM(total), 0) AS ganancias_totales,
                    COUNT(*) AS total_facturas,
                    IFNULL(AVG(total), 0) AS promedio_factura,
                    IFNULL(MAX(total), 0) AS factura_mayor,
                    IFNULL(MIN(total), 0) AS factura_menor
                FROM facturas
            `);
            return rows[0];
        } catch (error) {
            throw new Error(`Error al obtener reporte financiero: ${error.message}`);
        }
    },

    /**
     * SUPERADMIN: Obtiene ganancias por mes
     */
    obtenerGananciasPorMes: async (año = null) => {
        try {
            const año_actual = año || new Date().getFullYear();
            const [rows] = await db.query(`
                SELECT 
                    MONTH(fecha) AS mes,
                    MONTHNAME(fecha) AS nombre_mes,
                    SUM(total) AS ganancias,
                    COUNT(*) AS cantidad_facturas
                FROM facturas
                WHERE YEAR(fecha) = ?
                GROUP BY MONTH(fecha), MONTHNAME(fecha)
                ORDER BY mes ASC
            `, [año_actual]);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener ganancias por mes: ${error.message}`);
        }
    },

    /**
     * SUPERADMIN: Obtiene ganancias por día
     */
    obtenerGananciasPorDia: async (inicio, fin) => {
        try {
            const [rows] = await db.query(`
                SELECT 
                    DATE(fecha) AS dia,
                    SUM(total) AS ganancias,
                    COUNT(*) AS cantidad_facturas
                FROM facturas
                WHERE fecha BETWEEN ? AND ?
                GROUP BY DATE(fecha)
                ORDER BY dia DESC
            `, [inicio, fin]);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener ganancias por día: ${error.message}`);
        }
    },

    /**
     * SUPERADMIN: Obtiene estadísticas completas del taller
     */
    obtenerEstadisticasCompletas: async () => {
        try {
            const [ganancias] = await db.query(`
                SELECT IFNULL(SUM(total), 0) AS total FROM facturas
            `);

            const [clientes] = await db.query(`
                SELECT COUNT(*) AS total FROM clientes
            `);

            const [ordenes] = await db.query(`
                SELECT COUNT(*) AS total FROM ordenes WHERE estado = 'terminado'
            `);

            const [motos] = await db.query(`
                SELECT COUNT(*) AS total FROM motos
            `);

            const [promedioCliente] = await db.query(`
                SELECT IFNULL(AVG(total_cliente), 0) AS promedio
                FROM (
                    SELECT SUM(f.total) AS total_cliente
                    FROM facturas f
                    GROUP BY f.cliente_id
                ) AS cliente_totals
            `);

            return {
                ganancias_totales: ganancias[0].total,
                total_clientes: clientes[0].total,
                ordenes_completadas: ordenes[0].total,
                total_motos: motos[0].total,
                promedio_ganancias_por_cliente: promedioCliente[0].promedio
            };
        } catch (error) {
            throw new Error(`Error al obtener estadísticas completas: ${error.message}`);
        }
    }
};

// CAMBIO: De module.exports a export default
export default reporteService;