import * as configuracionModel from '../models/configuracionModel.js';

export const configuracionService = {
  /**
   * Obtiene toda la configuración del sistema
   */
  obtenerTodo: async () => {
    return await configuracionModel.obtenerConfiguracion();
  },

  /**
   * Obtiene una configuración específica por clave
   */
  obtenerPorClave: async (clave) => {
    return await configuracionModel.obtenerConfiguracionPorClave(clave);
  },

  /**
   * Actualiza o crea una configuración
   */
  guardar: async (clave, valor, descripcion = "") => {
    return await configuracionModel.guardarConfiguracion(clave, valor, descripcion);
  },

  /**
   * Actualiza una configuración existente
   */
  actualizar: async (clave, valor) => {
    return await configuracionModel.actualizarConfiguracion(clave, valor);
  },

  /**
   * Elimina una configuración
   */
  eliminar: async (clave) => {
    return await configuracionModel.eliminarConfiguracion(clave);
  },

  /**
   * Obtiene las marcas de motos configuradas
   */
  obtenerMarcas: async () => {
    return await configuracionModel.obtenerMarcas();
  },

  /**
   * Guarda las marcas de motos
   * @param {array} marcas - Array de marcas
   */
  guardarMarcas: async (marcas) => {
    return await configuracionModel.guardarConfiguracion(
      'marcas_moto',
      JSON.stringify(marcas),
      'Marcas de motocicletas configuradas en el sistema'
    );
  },

  /**
   * Obtiene los precios de mano de obra
   */
  obtenerPreciosManodeObra: async () => {
    return await configuracionModel.obtenerPreciosManodeObra();
  },

  /**
   * Guarda los precios de mano de obra
   * @param {object} precios - Objeto con estructura de precios
   */
  guardarPreciosManodeObra: async (precios) => {
    return await configuracionModel.guardarConfiguracion(
      'precios_mano_de_obra',
      JSON.stringify(precios),
      'Precios de mano de obra por tipo de reparación'
    );
  },

  /**
   * Obtiene la configuración como un objeto de pares clave-valor
   */
  obtenerComoObjeto: async () => {
    const configs = await configuracionModel.obtenerConfiguracion();
    const objeto = {};

    configs.forEach(config => {
      try {
        // Intentar parsear como JSON
        objeto[config.clave] = JSON.parse(config.valor);
      } catch (e) {
        // Si no es JSON, guardar como string
        objeto[config.clave] = config.valor;
      }
    });

    return objeto;
  },
};

export default configuracionService;
