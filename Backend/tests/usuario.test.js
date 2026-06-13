import { jest } from '@jest/globals';

// 1. Configurar los mocks ANTES de importar los módulos reales
jest.unstable_mockModule('../src/config/db.js', () => ({
  default: {
    query: jest.fn()
  }
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: {
    genSalt: jest.fn(() => 'salt'),
    hash: jest.fn(() => 'hashedPassword'),
  }
}));

// 2. Importar de forma asíncrona (dinámica) los módulos a testear
const db = (await import('../src/config/db.js')).default;
const { findUserByEmail } = await import('../src/models/userModel.js');
const usuarioService = (await import('../src/services/usuarioService.js')).default;
const { crearUsuario } = await import('../src/controllers/usuarioController.js');

describe('Taller: Pruebas Unitarias - Módulo Usuario', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // A. Capa de Modelo
  describe('Capa de Modelo (userModel.js)', () => {
    test('1. testDeberiaRetornarUsuarioPorEmailSiExiste: Verificar que el modelo retorna un usuario válido', async () => {
      // Arrange
      const mockUser = { id: 1, nombre: 'Test', email: 'test@test.com' };
      db.query.mockResolvedValueOnce([[mockUser]]);

      // Act
      const result = await findUserByEmail('test@test.com');

      // Assert
      expect(result).toEqual(mockUser);
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM usuarios WHERE email = ?", ['test@test.com']);
    });

    test('2. testDeberiaRetornarUndefinedSiUsuarioNoExiste: Verificar que el modelo retorna undefined si no hay registros', async () => {
      // Arrange
      db.query.mockResolvedValueOnce([[]]);

      // Act
      const result = await findUserByEmail('noexiste@test.com');

      // Assert
      expect(result).toBeUndefined();
    });
  });

  // B. Capa de Servicios
  describe('Capa de Servicios (usuarioService.js)', () => {
    test('3. testDeberiaLanzarExcepcionSiEmailEsInvalido: Verificar validación de formato de correo', async () => {
      // Arrange
      const userData = { nombre: 'Juan', email: 'correoinvalido', password: '123', role: 'cliente' };

      // Act & Assert
      await expect(usuarioService.save(userData)).rejects.toThrow("El formato del correo no es válido");
    });

    test('4. testDeberiaAsignarRolLanzarErrorSiRolEsInvalido: Verificar reglas de negocio para asignación de roles', async () => {
      // Arrange
      const usuarioId = 1;
      const nuevoRol = 'hacker'; // Rol inválido

      // Act & Assert
      await expect(usuarioService.asignarRol(usuarioId, nuevoRol)).rejects.toThrow("Rol inválido. Roles válidos: superadmin, admin, mecanico, cliente");
    });
  });

  // C. Capa de Controladores
  describe('Capa de Controladores (usuarioController.js)', () => {
    test('5. testDeberiaRetornarStatus201YUsuarioCreado: Verificar que una petición POST exitosa devuelva un 201 Created', async () => {
      // Arrange
      const req = {
        body: { nombre: 'Ana', email: 'ana@test.com', password: '123', role: 'cliente' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // Mockeamos el servicio para que no intente ejecutar la lógica real
      jest.spyOn(usuarioService, 'save').mockResolvedValue({ insertId: 5 });

      // Act
      await crearUsuario(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        mensaje: "Usuario creado con éxito",
        id: 5
      });
    });
  });
});
