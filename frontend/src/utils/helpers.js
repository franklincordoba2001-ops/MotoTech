/**
 
 * @param {number|string} value 
 * @returns {string} 
 */
export const formatCurrency = (value) => {
  const num = Number(value);
  const val = isNaN(num) ? 0 : num;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(val);
};

/**
 
 * @param {string} dateString 
 * @returns {string} 
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  
  
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 
 * @param {string} email 
 * @returns {boolean} 
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/*
 
 
 */
export const validatePassword = (password) => {
  return typeof password === "string" && password.trim().length >= 6;
};
