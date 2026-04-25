// CAMBIO: Importación moderna con extensión .js
import db from '../config/db.js';

const rolService = {
    
    save: async (rolData) => {
        const { nombre } = rolData;
        const [result] = await db.query("INSERT INTO roles (nombre) VALUES (?)", [nombre]);
        return result;
    },

   
    listAll: async () => {
        const [rows] = await db.query("SELECT * FROM roles");
        return rows;
    },

    
    listById: async (id) => {
        const [rows] = await db.query("SELECT * FROM roles WHERE id = ?", [id]);
        return rows[0];
    },

    
    update: async (id, rolData) => {
        const { nombre } = rolData;
        const [result] = await db.query("UPDATE roles SET nombre = ? WHERE id = ?", [nombre, id]);
        return result;
    },

    
    delete: async (id) => {
        const [result] = await db.query("DELETE FROM roles WHERE id = ?", [id]);
        return result;
    },
};

// CAMBIO: Exportación por defecto
export default rolService;