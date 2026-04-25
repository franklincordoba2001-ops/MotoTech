import db from '../config/db.js'; 
import bcrypt from 'bcrypt'; 

const usuarioService = {
    
    save: async (userData) => {
        const { nombre, email, password, role } = userData;
        
        
        if (!email.includes('@')) {
            throw new Error("El formato del correo no es válido");
        }

        
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

       
        const finalRole = (role === 'usuario' || !role) ? 'empleado' : role;

        const sql = "INSERT INTO usuarios (nombre, email, password, role) VALUES (?, ?, ?, ?)";
        const [result] = await db.query(sql, [nombre, email, hashedPassword, finalRole]);
        return result;
    },

    listAll: async () => {
        
        const [rows] = await db.query("SELECT id, nombre, email, role FROM usuarios");
        return rows;
    },

    listById: async (id) => {
        const [rows] = await db.query("SELECT id, nombre, email, role FROM usuarios WHERE id = ?", [id]);
        return rows[0]; 
    },

    update: async (id, userData) => {
        const { nombre, email, password, role } = userData;
        
        
        const finalRole = (role === 'usuario') ? 'empleado' : role;

        
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const sql = "UPDATE usuarios SET nombre = ?, email = ?, password = ?, role = ? WHERE id = ?";
            const [result] = await db.query(sql, [nombre, email, hashedPassword, finalRole, id]);
            return result;
        } else {
            const sql = "UPDATE usuarios SET nombre = ?, email = ?, role = ? WHERE id = ?";
            const [result] = await db.query(sql, [nombre, email, finalRole, id]);
            return result;
        }
    },

    delete: async (id) => {
        const [result] = await db.query("DELETE FROM usuarios WHERE id = ?", [id]);
        return result;
    }
};

export default usuarioService;