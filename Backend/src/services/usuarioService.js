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
    },

    /**
     * SUPERADMIN: Asigna un rol específico a un usuario
     */
    asignarRol: async (usuarioId, nuevoRol) => {
        const rolesValidos = ['superadmin', 'admin', 'mecanico', 'cliente'];
        
        if (!rolesValidos.includes(nuevoRol)) {
            throw new Error(`Rol inválido. Roles válidos: ${rolesValidos.join(', ')}`);
        }

        const sql = "UPDATE usuarios SET role = ? WHERE id = ?";
        const [result] = await db.query(sql, [nuevoRol, usuarioId]);
        
        if (result.affectedRows === 0) {
            throw new Error("Usuario no encontrado");
        }

        return result;
    },

    /**
     * SUPERADMIN: Obtiene estadísticas de usuarios
     */
    obtenerEstadisticas: async () => {
        try {
            // Total de usuarios
            const [totalRows] = await db.query("SELECT COUNT(*) as total FROM usuarios");
            const total = totalRows[0].total;

            // Usuarios por rol
            const [porRol] = await db.query(`
                SELECT role, COUNT(*) as cantidad 
                FROM usuarios 
                GROUP BY role
            `);

            // Usuarios recientemente creados
            const [recientes] = await db.query(`
                SELECT id, nombre, email, role, creado_en 
                FROM usuarios 
                ORDER BY creado_en DESC 
                LIMIT 10
            `);

            return {
                total,
                porRol: porRol.reduce((acc, { role, cantidad }) => {
                    acc[role] = cantidad;
                    return acc;
                }, {}),
                recientes
            };
        } catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    },

    /**
     * SUPERADMIN: Obtiene usuarios filtrados por rol
     */
    obtenerPorRol: async (role) => {
        const [rows] = await db.query(
            "SELECT id, nombre, email, role FROM usuarios WHERE role = ?",
            [role]
        );
        return rows;
    },

    /**
     * SUPERADMIN: Desactiva un usuario (sin eliminarlo)
     */
    desactivarUsuario: async (usuarioId) => {
        const sql = "UPDATE usuarios SET activo = 0 WHERE id = ?";
        const [result] = await db.query(sql, [usuarioId]);
        
        if (result.affectedRows === 0) {
            throw new Error("Usuario no encontrado");
        }

        return result;
    },

    /**
     * SUPERADMIN: Activa un usuario desactivado
     */
    activarUsuario: async (usuarioId) => {
        const sql = "UPDATE usuarios SET activo = 1 WHERE id = ?";
        const [result] = await db.query(sql, [usuarioId]);
        
        if (result.affectedRows === 0) {
            throw new Error("Usuario no encontrado");
        }

        return result;
    }
};

export default usuarioService;