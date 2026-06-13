# 🧪 Guía Completa de Código de Pruebas Unitarias (Jest - Backend)

Esta guía contiene el **código exacto** de cada una de tus pruebas del backend. Para cada caso se muestra el código cuando la prueba **pasa con éxito** y la modificación exacta de la línea de código para hacerla **fallar**.

---

## 🛠️ Comandos para ejecutar las pruebas
Ejecuta estos comandos en tu terminal dentro de la carpeta `Backend/`:
* `npm test tests/usuario.test.js` (Para correr las pruebas de Usuarios)
* `npm test tests/factura.test.js` (Para correr las pruebas de Facturas)

---

## 👤 Archivo: `Backend/tests/usuario.test.js`

### 1. `testDeberiaRetornarUsuarioPorEmailSiExiste`
#### ✅ Cuando pasa bien:
```javascript
test('1. testDeberiaRetornarUsuarioPorEmailSiExiste: Verificar que el modelo retorna un usuario válido', async () => {
  // Arrange
  const mockUser = { id: 1, nombre: 'Test', email: 'test@test.com' };
  db.query.mockResolvedValueOnce([[mockUser]]);

  // Act
  const result = await findUserByEmail('test@test.com');

  // Assert
  expect(result).toEqual(mockUser); // <--- Línea 40: Pasa porque result es igual a mockUser
  expect(db.query).toHaveBeenCalledWith("SELECT * FROM usuarios WHERE email = ?", ['test@test.com']);
});
```
#### ❌ Modificar para que falle (Línea 40):
Cambia `expect(result).toEqual(mockUser);` por:
```javascript
expect(result).toEqual({ id: 999, nombre: 'Usuario Falso', email: 'error@test.com' });
```

---

### 2. `testDeberiaRetornarUndefinedSiUsuarioNoExiste`
#### ✅ Cuando pasa bien:
```javascript
test('2. testDeberiaRetornarUndefinedSiUsuarioNoExiste: Verificar que el modelo retorna undefined si no hay registros', async () => {
  // Arrange
  db.query.mockResolvedValueOnce([[]]);

  // Act
  const result = await findUserByEmail('noexiste@test.com');

  // Assert
  expect(result).toBeUndefined(); // <--- Línea 52: Pasa porque el resultado es undefined
});
```
#### ❌ Modificar para que falle (Línea 52):
Cambia `expect(result).toBeUndefined();` por:
```javascript
expect(result).toBeDefined();
```

---

### 3. `testDeberiaLanzarExcepcionSiEmailEsInvalido`
#### ✅ Cuando pasa bien:
```javascript
test('3. testDeberiaLanzarExcepcionSiEmailEsInvalido: Verificar validación de formato de correo', async () => {
  // Arrange
  const userData = { nombre: 'Juan', email: 'correoinvalido', password: '123', role: 'cliente' }; // <--- Línea 60

  // Act & Assert
  await expect(usuarioService.save(userData)).rejects.toThrow("El formato del correo no es válido");
});
```
#### ❌ Modificar para que falle (Línea 60):
Cambia el email `'correoinvalido'` por un email válido para que no lance la excepción y el test falle:
```javascript
const userData = { nombre: 'Juan', email: 'correo@valido.com', password: '123', role: 'cliente' };
```

---

### 4. `testDeberiaAsignarRolLanzarErrorSiRolEsInvalido`
#### ✅ Cuando pasa bien:
```javascript
test('4. testDeberiaAsignarRolLanzarErrorSiRolEsInvalido: Verificar reglas de negocio para asignación de roles', async () => {
  // Arrange
  const usuarioId = 1;
  const nuevoRol = 'hacker'; // <--- Línea 69: 'hacker' es un rol inválido

  // Act & Assert
  await expect(usuarioService.asignarRol(usuarioId, nuevoRol)).rejects.toThrow("Rol inválido. Roles válidos: superadmin, admin, mecanico, cliente");
});
```
#### ❌ Modificar para que falle (Línea 69):
Cambia el rol inválido `'hacker'` por un rol que sí sea válido (como `'admin'`) para que no lance error y el test falle:
```javascript
const nuevoRol = 'admin';
```

---

### 5. `testDeberiaRetornarStatus201YUsuarioCreado`
#### ✅ Cuando pasa bien:
```javascript
test('5. testDeberiaRetornarStatus201YUsuarioCreado: Verificar que una petición POST exitosa devuelva un 201 Created', async () => {
  // Arrange
  const req = {
    body: { nombre: 'Ana', email: 'ana@test.com', password: '123', role: 'cliente' }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  jest.spyOn(usuarioService, 'save').mockResolvedValue({ insertId: 5 });

  // Act
  await crearUsuario(req, res);

  // Assert
  expect(res.status).toHaveBeenCalledWith(201); // <--- Línea 95: Pasa porque el status devuelto es 201
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    mensaje: "Usuario creado con éxito",
    id: 5
  });
});
```
#### ❌ Modificar para que falle (Línea 95):
Cambia el código de estado esperado `201` por `200`:
```javascript
expect(res.status).toHaveBeenCalledWith(200);
```

---

## 📄 Archivo: `Backend/tests/factura.test.js`

### 1. `testFacturaModelDeberiaRetornarFacturaPorId`
#### ✅ Cuando pasa bien:
```javascript
test('1. testFacturaModelDeberiaRetornarFacturaPorId: Verificar que el modelo retorna una factura existente', async () => {
  // Arrange
  const mockFactura = { id: 10, total: 50000, metodo_pago: 'Efectivo' };
  db.query.mockResolvedValueOnce([[mockFactura]]);

  // Act
  const result = await facturaModel.getFacturaById(10);

  // Assert
  expect(result).toEqual(mockFactura); // <--- Línea 33: Pasa porque result es igual a mockFactura
  expect(db.query).toHaveBeenCalledWith("SELECT * FROM facturas WHERE id = ?", [10]);
});
```
#### ❌ Modificar para que falle (Línea 33):
Cambia `expect(result).toEqual(mockFactura);` por:
```javascript
expect(result).toBeNull();
```

---

### 2. `testFacturaModelDeberiaRetornarUndefinedSiFacturaNoExiste`
#### ✅ Cuando pasa bien:
```javascript
test('2. testFacturaModelDeberiaRetornarUndefinedSiFacturaNoExiste: Verificar control de vacíos en el modelo', async () => {
  // Arrange
  db.query.mockResolvedValueOnce([[]]);

  // Act
  const result = await facturaModel.getFacturaById(999);

  // Assert
  expect(result).toBeUndefined(); // <--- Línea 45: Pasa porque la DB devolvió vacío
});
```
#### ❌ Modificar para que falle (Línea 45):
Cambia `expect(result).toBeUndefined();` por:
```javascript
expect(result).toEqual({ id: 999 });
```

---

### 3. `testReporteServiceDeberiaLanzarExcepcionSiTotalEsNegativo`
#### ✅ Cuando pasa bien:
```javascript
test('3. testReporteServiceDeberiaLanzarExcepcionSiTotalEsNegativo: Verificar validación de regla de negocio', async () => {
  // Arrange
  const facturaData = { orden_id: 1, total: -15000, metodo_pago: 'Tarjeta' }; // <--- Línea 53

  // Act & Assert
  await expect(reporteService.save(facturaData)).rejects.toThrow("El total del reporte no puede ser negativo");
});
```
#### ❌ Modificar para que falle (Línea 53):
Cambia el total negativo `-15000` por uno válido para que no lance error y el test falle:
```javascript
const facturaData = { orden_id: 1, total: 15000, metodo_pago: 'Tarjeta' };
```

---

### 4. `testReporteServiceDeberiaGuardarFacturaCorrectamente`
#### ✅ Cuando pasa bien:
```javascript
test('4. testReporteServiceDeberiaGuardarFacturaCorrectamente: Verificar flujo lógico de guardado exitoso', async () => {
  // Arrange
  const facturaData = { orden_id: 2, total: 100000, metodo_pago: 'Efectivo' };
  db.query.mockResolvedValueOnce([{ insertId: 5 }]); 

  // Act
  const result = await reporteService.save(facturaData);

  // Assert
  expect(result).toEqual({ insertId: 5 }); // <--- Línea 68: Pasa porque insertId coincide
  expect(db.query).toHaveBeenCalledWith(
    expect.stringContaining("INSERT INTO facturas"), 
    [2, 100000, 'Efectivo']
  );
});
```
#### ❌ Modificar para que falle (Línea 68):
Cambia `expect(result).toEqual({ insertId: 5 });` por:
```javascript
expect(result).toEqual({ insertId: 999 });
```

---

### 5. `testFacturaControllerDeberiaRetornarStatus201YMensajeExito`
#### ✅ Cuando pasa bien:
```javascript
test('5. testFacturaControllerDeberiaRetornarStatus201YMensajeExito: Verificar creación exitosa desde la API', async () => {
  // Arrange
  const req = {
    body: { orden_id: 3, total: 85000, metodo_pago: 'Transferencia' }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  jest.spyOn(reporteService, 'save').mockResolvedValue({ insertId: 7 });

  // Act
  await facturaController.crearFactura(req, res);

  // Assert
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({
    mensaje: "Reporte guardado", // <--- Línea 98: Mensaje esperado
    id: 7
  });
});
```
#### ❌ Modificar para que falle (Línea 98):
Cambia el string `"Reporte guardado"` por otra frase para que cause discrepancia:
```javascript
mensaje: "Error de Guardado / Factura incorrecta",
```
