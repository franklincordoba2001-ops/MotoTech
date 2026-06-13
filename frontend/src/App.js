import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Usuarios from "./pages/Usuarios";
import Roles from "./pages/Roles";
import Ordenes from "./pages/Ordenes";
import Facturas from "./pages/Facturas";
import Motos from "./pages/Motos"; 
import Reportes from "./pages/Reportes";
import Config from "./pages/Config";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#12110f',
            color: '#f8f9fa',
            border: '1px solid rgba(229, 193, 88, 0.25)',
            borderRadius: '0px',
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.55)',
          },
          success: {
            iconTheme: {
              primary: '#00e88f',
              secondary: '#12110f',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff3b30',
              secondary: '#12110f',
            },
          },
        }}
      />
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* 👈 2. Nueva ruta pública para autoregistro */}

        {/* Rutas Privadas (Protegidas) */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/clientes" element={
          <PrivateRoute allowedRoles={["superadmin", "admin"]}>
            <Clientes />
          </PrivateRoute>
        } />

        <Route path="/usuarios" element={
          <PrivateRoute allowedRoles={["superadmin"]}>
            <Usuarios />
          </PrivateRoute>
        } />



        <Route path="/motos" element={ 
          <PrivateRoute>
            <Motos /> 
          </PrivateRoute>
        } />

        <Route path="/ordenes" element={
          <PrivateRoute>
            <Ordenes />
          </PrivateRoute>
        } />

        <Route path="/facturas" element={
          <PrivateRoute allowedRoles={["superadmin", "admin", "cliente"]}>
            <Facturas />
          </PrivateRoute>
        } />
        <Route path="/reportes" element={
          <PrivateRoute allowedRoles={["superadmin"]}>
            <Reportes />
          </PrivateRoute>
        } />

        <Route path="/config" element={
          <PrivateRoute allowedRoles={["superadmin"]}>
            <Config />
          </PrivateRoute>
        } />

        <Route path="/roles" element={
          <PrivateRoute allowedRoles={["superadmin"]}>
            <Roles />
          </PrivateRoute>
        } />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;