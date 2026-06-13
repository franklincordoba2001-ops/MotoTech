import configuracionService from '../services/configuracionService.js';

/**
 * Obtiene la ubicación del taller (no requiere autenticación)
 */
export const getUbicacionTaller = (req, res) => {
    const ubicacion = {
        nombre: "MotoTech Mocoa",
        direccion: "Barrio Centro, Mocoa, Putumayo",
        lat: 1.1478, 
        lng: -76.6476, 
        googleMapsUrl: "https://www.google.com/maps?q=1.1478,-76.6476"
    };
    
    res.json(ubicacion);
};

/**
 * SOLO SUPERADMIN: Obtiene toda la configuración del sistema
 */
export const obtenerConfiguracion = async (req, res) => {
    try {
        const config = await configuracionService.obtenerComoObjeto();
        res.json({
            success: true,
            data: config,
            message: "Configuración del sistema obtenida"
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message,
            message: "Error al obtener configuración"
        });
    }
};

/**
 * SOLO SUPERADMIN: Obtiene una configuración específica
 */
export const obtenerConfiguracionPorClave = async (req, res) => {
    try {
        const { clave } = req.params;
        const config = await configuracionService.obtenerPorClave(clave);
        
        if (!config) {
            return res.status(404).json({ 
                success: false,
                message: `Configuración no encontrada: ${clave}`
            });
        }

        res.json({
            success: true,
            data: config,
            message: "Configuración obtenida"
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message,
            message: "Error al obtener configuración"
        });
    }
};

/**
 * SOLO SUPERADMIN: Actualiza la configuración del sistema
 */
export const actualizarConfiguracion = async (req, res) => {
    try {
        const { clave, valor, descripcion } = req.body;

        if (!clave || valor === undefined) {
            return res.status(400).json({ 
                success: false,
                message: "Debe proporcionar clave y valor"
            });
        }

        const resultado = await configuracionService.guardar(clave, valor, descripcion || "");

        res.json({
            success: true,
            message: "Configuración actualizada exitosamente",
            data: { clave, valor }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message,
            message: "Error al actualizar configuración"
        });
    }
};

/**
 * SOLO SUPERADMIN: Obtiene las marcas de moto configuradas
 */
export const obtenerMarcas = async (req, res) => {
    try {
        const marcas = await configuracionService.obtenerMarcas();
        res.json({
            success: true,
            data: marcas,
            message: "Marcas de moto obtenidas"
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message,
            message: "Error al obtener marcas"
        });
    }
};

/**
 * SOLO SUPERADMIN: Actualiza las marcas de moto
 */
export const actualizarMarcas = async (req, res) => {
    try {
        const { marcas } = req.body;

        if (!Array.isArray(marcas)) {
            return res.status(400).json({ 
                success: false,
                message: "Las marcas deben ser un arreglo"
            });
        }

        await configuracionService.guardarMarcas(marcas);

        res.json({
            success: true,
            message: "Marcas de moto actualizadas exitosamente",
            data: marcas
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message,
            message: "Error al actualizar marcas"
        });
    }
};

/**
 * SOLO SUPERADMIN: Obtiene los precios de mano de obra
 */
export const obtenerPreciosManodeObra = async (req, res) => {
    try {
        const precios = await configuracionService.obtenerPreciosManodeObra();
        res.json({
            success: true,
            data: precios,
            message: "Precios de mano de obra obtenidos"
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message,
            message: "Error al obtener precios"
        });
    }
};

/**
 * SOLO SUPERADMIN: Actualiza los precios de mano de obra
 */
export const actualizarPreciosManodeObra = async (req, res) => {
    try {
        const precios = req.body;

        if (!precios || typeof precios !== 'object') {
            return res.status(400).json({ 
                success: false,
                message: "Los precios deben ser un objeto válido"
            });
        }

        await configuracionService.guardarPreciosManodeObra(precios);

        res.json({
            success: true,
            message: "Precios de mano de obra actualizados exitosamente",
            data: precios
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message,
            message: "Error al actualizar precios"
        });
    }
};

/**
 * SOLO SUPERADMIN: Elimina una configuración
 */
export const eliminarConfiguracion = async (req, res) => {
    try {
        const { clave } = req.params;

        // Prevenir eliminación de configuraciones críticas
        const configuracionesCriticas = ['marcas_moto', 'precios_mano_de_obra'];
        if (configuracionesCriticas.includes(clave)) {
            return res.status(400).json({ 
                success: false,
                message: `No se puede eliminar la configuración crítica: ${clave}`
            });
        }

        await configuracionService.eliminar(clave);

        res.json({
            success: true,
            message: "Configuración eliminada exitosamente",
            data: { clave }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message,
            message: "Error al eliminar configuración"
        });
    }
};
