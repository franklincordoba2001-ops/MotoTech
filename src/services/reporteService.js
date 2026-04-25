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
    }
};

// CAMBIO: De module.exports a export default
export default reporteService;