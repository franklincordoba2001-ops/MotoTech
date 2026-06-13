import { formatCurrency, formatDate, validateEmail, validatePassword } from "./helpers";

describe("Pruebas Unitarias - Funciones de Utilidad (Helpers)", () => {
  
  describe("formatCurrency", () => {
    test("debería formatear correctamente valores numéricos a pesos colombianos (COP)", () => {
      
      const result = formatCurrency(15000).replace(/\u00a0/g, " ");
      expect(result).toContain("$");
      expect(result).toContain("15.000");
    });

    test("debería retornar el formato de $ 0 si el valor no es un número válido", () => {
      const result1 = formatCurrency("invalido").replace(/\u00a0/g, " ");
      const result2 = formatCurrency(null).replace(/\u00a0/g, " ");
      expect(result1).toContain("$");
      expect(result1).toContain("0");
      expect(result2).toContain("$");
      expect(result2).toContain("0");
    });
  });

  describe("formatDate", () => {
    test("debería formatear correctamente fechas válidas a DD/MM/AAAA", () => {
      expect(formatDate("2026-05-22T00:00:00.000Z")).toBe("22/05/2026");
      expect(formatDate("2026-12-01")).toBe("01/12/2026");
    });

    test("debería retornar cadena vacía para fechas inválidas o vacías", () => {
      expect(formatDate("")).toBe("");
      expect(formatDate(null)).toBe("");
      expect(formatDate("fecha-invalida")).toBe("");
    });
  });

  describe("validateEmail", () => {
    test("debería retornar true para correos válidos", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name+tag@domain.co.uk")).toBe(true);
    });

    test("debería retornar false para correos inválidos o vacíos", () => {
      expect(validateEmail("testexample.com")).toBe(false);
      expect(validateEmail("test@example")).toBe(false);
      expect(validateEmail("")).toBe(false);
      expect(validateEmail(null)).toBe(false);
    });
  });

  describe("validatePassword", () => {
    test("debería retornar true si la contraseña tiene al menos 6 caracteres", () => {
      expect(validatePassword("123456")).toBe(true);
      expect(validatePassword("password123")).toBe(true);
    });

    test("debería retornar false si tiene menos de 6 caracteres o no es string", () => {
      expect(validatePassword("12345")).toBe(false);
      expect(validatePassword("")).toBe(false);
      expect(validatePassword(123456)).toBe(false);
      expect(validatePassword(null)).toBe(false);
    });
  });
  
});
