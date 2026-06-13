import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Clientes from "./Clientes";
import { getClientes, createCliente } from "../services/api";
import toast from "react-hot-toast";

jest.mock("../components/Navbar", () => {
  return function DummyNavbar() {
    return <div data-testid="navbar">Navbar Mock</div>;
  };
});

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock("../services/api", () => ({
  getClientes: jest.fn(),
  createCliente: jest.fn(),
  updateCliente: jest.fn(),
  deleteCliente: jest.fn(),
}));

describe("Pruebas de Integración - Módulo de Clientes (Clientes.js)", () => {
  const mockToken = "test-token";
  const mockClientes = [
    { id: 1, nombre: "Juan Pérez", telefono: "3001234567" },
    { id: 2, nombre: "María Gómez", telefono: "3119876543" },
  ];

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("token", mockToken);
    jest.clearAllMocks();
    
    jest.spyOn(window, "alert").mockImplementation(() => {});
    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("1. Renderizado de Listas con Datos: Debería renderizar la lista de clientes obtenida de la API en el montaje", async () => {
    
    getClientes.mockResolvedValueOnce(mockClientes);

    render(<Clientes />);

    expect(getClientes).toHaveBeenCalledWith(mockToken);

    await waitFor(() => {
      expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
      expect(screen.getByText("María Gómez")).toBeInTheDocument();
      expect(screen.getByText("3001234567")).toBeInTheDocument();
      expect(screen.getByText("3119876543")).toBeInTheDocument();
    });

    expect(screen.getByText("2 clientes registrados")).toBeInTheDocument();
  });

  test("2. Flujo de un Formulario: Debería poder ingresar datos y registrar un nuevo cliente con éxito", async () => {
    
    getClientes
      .mockResolvedValueOnce(mockClientes)
      .mockResolvedValueOnce([
        ...mockClientes,
        { id: 3, nombre: "Carlos Rojas", telefono: "3205556677" },
      ]);
    createCliente.mockResolvedValueOnce({ id: 3, nombre: "Carlos Rojas", telefono: "3205556677" });

    render(<Clientes />);

    await waitFor(() => {
      expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    });

    const inputNombre = screen.getByPlaceholderText("Nombre completo");
    const inputTelefono = screen.getByPlaceholderText("300 123 4567");
    const botonRegistrar = screen.getByText("Registrar cliente");

    fireEvent.change(inputNombre, { target: { value: "Carlos Rojas" } });
    fireEvent.change(inputTelefono, { target: { value: "3205556677" } });

    fireEvent.click(botonRegistrar);

    expect(createCliente).toHaveBeenCalledWith(
      { nombre: "Carlos Rojas", telefono: "3205556677", direccion: "", email: "" },
      mockToken
    );

    await waitFor(() => {
      expect(inputNombre.value).toBe("");
      expect(inputTelefono.value).toBe("");
      expect(screen.getByText("Carlos Rojas")).toBeInTheDocument();
    });
  });

  test("3. Validación de Campos: Debería mostrar un alert si intenta enviar campos vacíos", async () => {
    getClientes.mockResolvedValueOnce([]);
    render(<Clientes />);

    await screen.findByText("No hay clientes registrados en MotoTech.");

    const botonRegistrar = screen.getByText("Registrar cliente");
    fireEvent.click(botonRegistrar);

    expect(toast.error).toHaveBeenCalledWith("⚠️ Por favor, ingresa el nombre y el teléfono.");
    expect(createCliente).not.toHaveBeenCalled();
  });
});
