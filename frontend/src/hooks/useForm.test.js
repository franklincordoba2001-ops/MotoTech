import { renderHook, act } from "@testing-library/react";
import { useForm } from "./useForm";

describe("Pruebas Unitarias - Custom Hook (useForm)", () => {
  const initialValues = {
    email: "",
    username: "",
  };

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "El correo es requerido";
    } else if (!values.email.includes("@")) {
      errors.email = "El correo no es válido";
    }
    if (!values.username) {
      errors.username = "El nombre de usuario es requerido";
    }
    return errors;
  };

  test("debería inicializar los valores y errores correctamente", () => {
    const { result } = renderHook(() => useForm(initialValues, validate));

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  test("debería actualizar los valores al llamar a handleChange", () => {
    const { result } = renderHook(() => useForm(initialValues, validate));

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "test@example.com" },
      });
    });

    expect(result.current.values.email).toBe("test@example.com");
  });

  test("debería ejecutar la validación y no llamar a onSubmit si hay errores", () => {
    const mockOnSubmit = jest.fn();
    const { result } = renderHook(() => useForm(initialValues, validate, mockOnSubmit));

    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.errors.email).toBe("El correo es requerido");
    expect(result.current.errors.username).toBe("El nombre de usuario es requerido");
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("debería llamar a onSubmit con los datos del formulario si no hay errores", () => {
    const mockOnSubmit = jest.fn();
    const { result } = renderHook(() => useForm(initialValues, validate, mockOnSubmit));

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "user@domain.com" },
      });
      result.current.handleChange({
        target: { name: "username", value: "admin_user" },
      });
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.errors).toEqual({});
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: "user@domain.com",
      username: "admin_user",
    });
  });

  test("debería limpiar el error de un campo cuando cambia su valor", () => {
    const { result } = renderHook(() => useForm(initialValues, validate));

    
    act(() => {
      result.current.handleSubmit();
    });
    expect(result.current.errors.email).toBe("El correo es requerido");

    
    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "a" },
      });
    });

    expect(result.current.errors.email).toBeFalsy();
  });

  test("debería restablecer el formulario al llamar a resetForm", () => {
    const { result } = renderHook(() => useForm(initialValues, validate));

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "test@test.com" },
      });
    });

    expect(result.current.values.email).toBe("test@test.com");

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
  });
});
