import React from "react";
import { render } from "@testing-library/react";
import PrivateRoute from "./PrivateRoute";


jest.mock("react-router-dom", () => ({
  __esModule: true,
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
}));
jest.mock("react-router-dom/dist/index.js", () => ({
  __esModule: true,
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
}));
jest.mock("react-router", () => ({
  __esModule: true,
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
}));

describe("Pruebas Unitarias - Componente de UI (PrivateRoute)", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("debería redirigir a '/' si no hay token en localStorage (Usuario no autenticado)", () => {
    const { getByTestId, queryByTestId } = render(
      <PrivateRoute>
        <div data-testid="child">Contenido Privado</div>
      </PrivateRoute>
    );

    const navigate = getByTestId("navigate");
    expect(navigate).toBeInTheDocument();
    expect(navigate.getAttribute("data-to")).toBe("/");
    expect(queryByTestId("child")).not.toBeInTheDocument();
  });

  test("debería redirigir a '/dashboard' si el rol del usuario no está en allowedRoles (Acceso Denegado)", () => {
    localStorage.setItem("token", "fake-jwt-token");
    localStorage.setItem("rol", "cliente"); // rol no permitido para esta ruta

    const { getByTestId, queryByTestId } = render(
      <PrivateRoute allowedRoles={["admin", "superadmin"]}>
        <div data-testid="child">Contenido Privado</div>
      </PrivateRoute>
    );

    const navigate = getByTestId("navigate");
    expect(navigate).toBeInTheDocument();
    expect(navigate.getAttribute("data-to")).toBe("/dashboard");
    expect(queryByTestId("child")).not.toBeInTheDocument();
  });

  test("debería renderizar los hijos si hay token y el rol está incluido en allowedRoles (Acceso Concedido)", () => {
    localStorage.setItem("token", "fake-jwt-token");
    localStorage.setItem("rol", "admin"); 

    const { getByTestId, queryByTestId } = render(
      <PrivateRoute allowedRoles={["admin", "superadmin"]}>
        <div data-testid="child">Contenido Privado</div>
      </PrivateRoute>
    );

    expect(queryByTestId("navigate")).not.toBeInTheDocument();
    const child = getByTestId("child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Contenido Privado");
  });

  test("debería renderizar los hijos si hay token y no se especifican roles requeridos (Ruta privada general)", () => {
    localStorage.setItem("token", "fake-jwt-token");
    localStorage.setItem("rol", "mecanico");

    const { getByTestId, queryByTestId } = render(
      <PrivateRoute>
        <div data-testid="child">Contenido Privado General</div>
      </PrivateRoute>
    );

    expect(queryByTestId("navigate")).not.toBeInTheDocument();
    const child = getByTestId("child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Contenido Privado General");
  });
});
