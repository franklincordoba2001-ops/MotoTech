import { jest } from '@jest/globals';

// 1. Configurar los mocks ANTES de importar los módulos reales
jest.unstable_mockModule('../src/config/db.js', () => ({
  default: {
    query: jest.fn()
  }
}));

// 2. Importar de forma asíncrona (dinámica) los módulos a testear
const db = (await import('../src/config/db.js')).default;
const facturaModel = await import('../src/models/facturaModel.js');
const reporteService = (await import('../src/services/reporteService.js')).default;
const facturaController = await import('../src/controllers/facturaController.js');

describe('Taller: Pruebas Unitarias - Módulo Factura / Reportes', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // A. Capa de Modelo
  describe('Capa de Modelo (facturaModel.js)', () => {
    test('1. testFacturaModelDeberiaRetornarFacturaPorId: Verificar que el modelo retorna una factura existente', async () => {
      // Arrange
      const mockFactura = { id: 10, total: 50000, metodo_pago: 'Efectivo' };
      db.query.mockResolvedValueOnce([[mockFactura]]);

      // Act
      const result = await facturaModel.getFacturaById(10);

      // Assert
      expect(result).toEqual(mockFactura);
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM facturas WHERE id = ?", [10]);
    });

    test('2. testFacturaModelDeberiaRetornarUndefinedSiFacturaNoExiste: Verificar control de vacíos en el modelo', async () => {
      // Arrange
      db.query.mockResolvedValueOnce([[]]);

      // Act
      const result = await facturaModel.getFacturaById(999);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  // B. Capa de Servicios
  describe('Capa de Servicios (reporteService.js)', () => {
    test('3. testReporteServiceDeberiaLanzarExcepcionSiTotalEsNegativo: Verificar validación de regla de negocio', async () => {
      // Arrange
      const facturaData = { orden_id: 1, total: -15000, metodo_pago: 'Tarjeta' };

      // Act & Assert
      await expect(reporteService.save(facturaData)).rejects.toThrow("El total del reporte no puede ser negativo");
    });

    test('4. testReporteServiceDeberiaGuardarFacturaCorrectamente: Verificar flujo lógico de guardado exitoso', async () => {
      // Arrange
      const facturaData = { orden_id: 2, total: 100000, metodo_pago: 'Efectivo' };
      db.query.mockResolvedValueOnce([{ insertId: 5 }]); // Mock de respuesta exitosa de DB

      // Act
      const result = await reporteService.save(facturaData);

      // Assert
      expect(result).toEqual({ insertId: 5 });
      // Verifica que la consulta SQL contiene los campos esperados
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO facturas"), 
        [2, 100000, 'Efectivo']
      );
    });
  });

  // C. Capa de Controladores
  describe('Capa de Controladores (facturaController.js)', () => {
    test('5. testFacturaControllerDeberiaRetornarStatus201YMensajeExito: Verificar creación exitosa desde la API', async () => {
      // Arrange
      const req = {
        body: { orden_id: 3, total: 85000, metodo_pago: 'Transferencia' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // Mockeamos el servicio para aislar el controlador
      jest.spyOn(reporteService, 'save').mockResolvedValue({ insertId: 7 });

      // Act
      await facturaController.crearFactura(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: "Reporte guardado",
        id: 7
      });
    });
  });
});
