import { useState } from "react";

/**
 * Hook personalizado para manejar el estado y validación de formularios.
 * @param {Object} initialValues - Valores iniciales del formulario.
 * @param {Function} validate - Función de validación que recibe los valores y retorna un objeto de errores.
 * @param {Function} onSubmit - Función que se ejecuta al enviar el formulario de manera exitosa.
 */
export const useForm = (initialValues = {}, validate = () => ({}), onSubmit = () => {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    
    setValues((prev) => ({
      ...prev,
      [name]: val,
    }));
    
    // Limpiar error del campo que se está modificando
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const validationErrors = validate(values);
    if (validationErrors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors[name],
      }));
    }
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    const validationErrors = validate(values);
    const hasErrors = Object.keys(validationErrors).some(
      (key) => validationErrors[key]
    );

    if (hasErrors) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setIsSubmitting(true);
      try {
        onSubmit(values);
      } catch (error) {
        console.error("Error en onSubmit del formulario:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
  };
};
