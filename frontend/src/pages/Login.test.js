import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { login } from "../services/api";
import toast from "react-hot-toast";

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
  success: jest.fn(),
  error: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  __esModule: true,
  useNavigate: () => mockNavigate,
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));
jest.mock("react-router-dom/dist/index.js", () => ({
  __esModule: true,
  useNavigate: () => mockNavigate,
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));


jest.mock("../services/api", () => ({
  login: jest.fn(),
}));

describe("Pruebas de Integración - Flujo de Inicio de Sesión (Login.js)", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("debería poder iniciar sesión con credenciales válidas y guardar datos en localStorage", async () => {
    
    const mockApiResponse = {
      token: "fake-jwt-token-12345",
      user: {
        id: 99,
        role: "admin",
        nombre: "Administrador MotoTech",
      },
    };
    login.mockResolvedValueOnce(mockApiResponse);

    render(<Login />);

    
    const inputEmail = screen.getByPlaceholderText("admin@moto.com");
    const inputPassword = screen.getByPlaceholderText("••••••••");
    const botonIngresar = screen.getByText("Ingresar al Sistema");

   
    fireEvent.change(inputEmail, { target: { value: "admin@moto.com" } });
    fireEvent.change(inputPassword, { target: { value: "password123" } });

    
    fireEvent.click(botonIngresar);

    
    expect(login).toHaveBeenCalledWith({
      email: "admin@moto.com",
      password: "password123",
    });

    
    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("fake-jwt-token-12345");
      expect(localStorage.getItem("rol")).toBe("admin");
      expect(localStorage.getItem("nombre")).toBe("Administrador MotoTech");
      expect(localStorage.getItem("usuario_id")).toBe("99");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("debería mostrar un mensaje de error y no navegar si las credenciales son incorrectas", async () => {
    
    login.mockResolvedValueOnce({ token: null });

    render(<Login />);

    const inputEmail = screen.getByPlaceholderText("admin@moto.com");
    const inputPassword = screen.getByPlaceholderText("••••••••");
    const botonIngresar = screen.getByText("Ingresar al Sistema");

    fireEvent.change(inputEmail, { target: { value: "incorrecto@moto.com" } });
    fireEvent.change(inputPassword, { target: { value: "wrongpass" } });
    fireEvent.click(botonIngresar);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("❌ Credenciales incorrectas");
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  test("debería mostrar alerta si faltan campos obligatorios", async () => {
    render(<Login />);

    const botonIngresar = screen.getByText("Ingresar al Sistema");
    fireEvent.click(botonIngresar);

    expect(toast.error).toHaveBeenCalledWith("⚠️ Por favor, completa todos los campos.");
    expect(login).not.toHaveBeenCalled();
  });
});
