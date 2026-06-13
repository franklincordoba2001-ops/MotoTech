import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { getRoles, createRol, updateRol, deleteRol } from "../services/api";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  const cargar = useCallback(async () => {
    try {
      const data = await getRoles(token);
      setRoles(data || []);
    } catch (e) {
      console.error(e);
      setRoles([]);
    }
  }, [token]);

  useEffect(() => { cargar(); }, [cargar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre) {
      toast.error("Ingresa un nombre de rol");
      return;
    }
    try {
      if (editId) {
        await updateRol(editId, { nombre }, token);
        toast.success("✅ Rol actualizado con éxito");
        setEditId(null);
      } else {
        await createRol({ nombre }, token);
        toast.success("✅ Rol creado con éxito");
      }
      setNombre("");
      await cargar();
    } catch (err) {
      toast.error("Error: " + (err.message || err));
    }
  };

  const handleEdit = (r) => { setEditId(r.id); setNombre(r.nombre); };
  const handleDelete = (id) => {
    toast((t) => (
      <div>
        <p className="mb-3 text-light" style={{ fontSize: '13.5px', fontFamily: 'var(--font-sans)', lineHeight: '1.4', margin: 0 }}>
          ⚠️ <strong>¿Estás seguro de eliminar este rol?</strong>
          <br />
          <span className="text-secondary" style={{ fontSize: '12px' }}>Esto puede afectar los permisos de los usuarios asociados.</span>
        </p>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button 
            className="btn btn-sm btn-danger px-3 py-1.5 fw-bold"
            style={{ fontSize: '11px', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteRol(id, token);
                toast.success("✅ Rol eliminado con éxito");
                cargar();
              } catch (e) {
                toast.error("No se pudo eliminar: " + e.message);
              }
            }}
          >
            Confirmar
          </button>
          <button 
            className="btn btn-sm btn-secondary px-3 py-1.5 fw-bold"
            style={{ fontSize: '11px', borderRadius: '0px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </button>
        </div>
      </div>
    ), {
      duration: 8000,
      style: {
        background: '#12110f',
        border: '1px solid rgba(229, 193, 88, 0.35)',
        borderRadius: '0px',
        padding: '16px',
        minWidth: '320px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }
    });
  };

  return (
    <div className="min-vh-100">
      <Navbar />
      <div className="container py-4">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm">
              <h5 className="mb-3">{editId ? 'Editar rol' : 'Nuevo rol'}</h5>
              <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" placeholder="Nombre del rol" value={nombre} onChange={e => setNombre(e.target.value)} />
                <button className={`btn ${editId ? 'btn-warning' : 'btn-primary'} w-100`} type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
                {editId && <button type="button" className="btn btn-link mt-2" onClick={() => { setEditId(null); setNombre(''); }}>Cancelar</button>}
              </form>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead className="table-light"><tr><th>Nombre</th><th style={{width:150}}>Acciones</th></tr></thead>
                  <tbody>
                    {roles.map(r => (
                      <tr key={r.id}><td>{r.nombre}</td><td>
                        <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(r)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r.id)}>Eliminar</button>
                      </td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roles;
