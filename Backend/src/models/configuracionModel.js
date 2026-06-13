import db from "../config/db.js";

/**
 * Modelo para Configuración del Sistema
 * Almacena valores como: precios de mano de obra, marcas de moto, etc.
 */

export const obtenerConfiguracion = async () => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM configuracion ORDER BY creado_en DESC"
    );
    return rows;
  } catch (error) {
    throw new Error(`Error al obtener configuración: ${error.message}`);
  }
};

export const obtenerConfiguracionPorClave = async (clave) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM configuracion WHERE clave = ?",
      [clave]
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error al obtener configuración: ${error.message}`);
  }
};

export const guardarConfiguracion = async (clave, valor, descripcion = "") => {
  try {
    // Verificar si la clave ya existe
    const existente = await obtenerConfiguracionPorClave(clave);

    if (existente) {
      // Actualizar
      const [result] = await db.query(
        "UPDATE configuracion SET valor = ?, descripcion = ?, actualizado_en = NOW() WHERE clave = ?",
        [valor, descripcion, clave]
      );
      return result;
    } else {
      // Insertar
      const [result] = await db.query(
        "INSERT INTO configuracion (clave, valor, descripcion) VALUES (?, ?, ?)",
        [clave, valor, descripcion]
      );
      return result;
    }
  } catch (error) {
    throw new Error(`Error al guardar configuración: ${error.message}`);
  }
};

export const actualizarConfiguracion = async (clave, valor) => {
  try {
    const [result] = await db.query(
      "UPDATE configuracion SET valor = ?, actualizado_en = NOW() WHERE clave = ?",
      [valor, clave]
    );
    return result;
  } catch (error) {
    throw new Error(`Error al actualizar configuración: ${error.message}`);
  }
};

export const eliminarConfiguracion = async (clave) => {
  try {
    const [result] = await db.query(
      "DELETE FROM configuracion WHERE clave = ?",
      [clave]
    );
    return result;
  } catch (error) {
    throw new Error(`Error al eliminar configuración: ${error.message}`);
  }
};

/**
 * Obtiene configuración en formato JSON
 * Usado principalmente para precios y valores
 */
export const obtenerConfiguracionJSON = async (clave) => {
  try {
    const config = await obtenerConfiguracionPorClave(clave);
    if (!config) return null;
    
    try {
      return JSON.parse(config.valor);
    } catch (e) {
      return config.valor;
    }
  } catch (error) {
    throw new Error(`Error al obtener configuración JSON: ${error.message}`);
  }
};

/**
 * Obtiene todas las marcas de motos configuradas
 */
export const obtenerMarcas = async () => {
  try {
    const marcas = await obtenerConfiguracionJSON('marcas_moto');
    return marcas || [];
  } catch (error) {
    throw new Error(`Error al obtener marcas: ${error.message}`);
  }
};

/**
 * Obtiene los precios de mano de obra configurados
 */
export const obtenerPreciosManodeObra = async () => {
  try {
    const precios = await obtenerConfiguracionJSON('precios_mano_de_obra');
    return precios || {};
  } catch (error) {
    throw new Error(`Error al obtener precios de mano de obra: ${error.message}`);
  }
};

export default {
  obtenerConfiguracion,
  obtenerConfiguracionPorClave,
  guardarConfiguracion,
  actualizarConfiguracion,
  eliminarConfiguracion,
  obtenerConfiguracionJSON,
  obtenerMarcas,
  obtenerPreciosManodeObra,
};
