import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { getClientes, getOrdenes, getFacturas, getUsuarios } from "../services/api";

const direccionTaller = "Calle 8 # 12-45, Mocoa, Putumayo, Colombia";
const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(direccionTaller)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

const STAT_CARDS = (stats) => [
  { label: "Clientes",  value: stats.clientes,                      icon: "👥", accent: "#00b96b", bg: "#e6faf2", link: "/clientes" },
  { label: "Servicios", value: stats.ordenes,                       icon: "🔧", accent: "#378add", bg: "#e6f1fb", link: "/ordenes"  },
  { label: "Ingresos",  value: `$${stats.ganancias.toLocaleString()}`, icon: "💰", accent: "#ef9f27", bg: "#faeeda", link: "/facturas" },
  { label: "Staff",     value: stats.usuarios,                      icon: "🪪", accent: "#d4537e", bg: "#fbeaf0", link: "/usuarios" },
];

const QUICK_ACTIONS = [
  { title: "Registrar Moto",      desc: "Ingreso de nuevo vehículo al sistema",  icon: "🏍", to: "/motos",    alert: false },
  { title: "Nueva Factura",       desc: "Liquidar y cerrar un servicio",          icon: "🧾", to: "/facturas", alert: false },
  { title: "Reportes Mensuales",  desc: "Análisis de datos e ingresos",           icon: "📊", to: "#",        alert: true  },
];

function StatCard({ label, value, icon, accent, bg, link }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={link} style={{ textDecoration: "none" }}>
      <div
        style={{
          ...styles.statCard,
          transform: hovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
          background: hovered ? "var(--bg-card-hover)" : "var(--bg-card)",
          borderColor: hovered ? accent : "var(--border-color)",
          boxShadow: hovered 
            ? `0 12px 32px ${accent}25, 0 0 24px ${accent}15` 
            : "0 4px 16px rgba(0,0,0,0.3)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{ ...styles.statIcon, background: bg, fontSize: 24, boxShadow: `0 4px 12px ${accent}30` }}>{icon}</div>
        <div>
          <div style={{ ...styles.statValue, color: accent, textShadow: hovered ? `0 0 20px ${accent}40` : "none" }}>{value}</div>
          <div style={styles.statLabel}>{label}</div>
        </div>
        <div style={{ ...styles.statAccentBar, background: accent, opacity: hovered ? 1 : 0.6 }} />
      </div>
    </Link>
  );
}

function ActionCard({ title, desc, icon, to, alert: isAlert }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      style={{ textDecoration: "none" }}
      onClick={() => isAlert && toast("⚡ Próximamente...", { icon: "⏳" })}
    >
      <div
        style={{
          ...styles.actionCard,
          background: hovered ? "var(--bg-card-hover)" : "var(--bg-card)",
          borderColor: hovered ? "var(--accent-orange)" : "var(--border-color)",
          boxShadow: hovered 
            ? "0 12px 32px rgba(229, 193, 88, 0.15), 0 0 24px rgba(229, 193, 88, 0.1)" 
            : "0 4px 16px rgba(0,0,0,0.3)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{ ...styles.actionIcon, transform: hovered ? "scale(1.1) rotate(5deg)" : "scale(1)", transition: "transform 0.3s ease" }}>{icon}</div>
        <div style={styles.actionTitle}>{title}</div>
        <div style={styles.actionDesc}>{desc}</div>
        <div style={{ ...styles.actionArrow, opacity: hovered ? 1 : 0.6, transform: hovered ? "translateX(4px)" : "translateX(0)" }}>→</div>
      </div>
    </Link>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ clientes: 0, usuarios: 0, ordenes: 0, ganancias: 0, motos: 0, misFacturas: 0 });
  const token = localStorage.getItem("token");
  const rolUsuario = localStorage.getItem("rol") || localStorage.getItem("role") || "";

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (rolUsuario === "superadmin" || rolUsuario === "admin") {
          const [c, u, o, f] = await Promise.all([
            getClientes(token), getUsuarios(token), getOrdenes(token), getFacturas(token),
          ]);
          const totalGanancias = f.reduce((acc, curr) => acc + Number(curr.total || 0), 0);
          setStats(prev => ({ ...prev, clientes: c.length, usuarios: u.length, ordenes: o.length, ganancias: totalGanancias }));
        } else if (rolUsuario === "mecanico") {
          // Mecánico solo ve motos y órdenes
          // Necesita importar getMotos en top level, asumimos que ya está en api o que getOrdenes funciona
          const o = await getOrdenes(token);
          setStats(prev => ({ ...prev, ordenes: o.length }));
        } else if (rolUsuario === "cliente") {
          // Cliente ve sus propias órdenes y facturas (el backend ya filtra)
          const [o, f] = await Promise.all([
            getOrdenes(token), getFacturas(token)
          ]);
          setStats(prev => ({ ...prev, ordenes: o.length, misFacturas: f.length }));
        }
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
    };
    cargarDatos();
  }, [token, rolUsuario]);

  const getRoleStats = () => {
    if (rolUsuario === "superadmin" || rolUsuario === "admin") {
      return [
        { label: "Clientes",  value: stats.clientes,                      icon: "👥", accent: "#00b96b", bg: "#e6faf2", link: "/clientes" },
        { label: "Órdenes", value: stats.ordenes,                       icon: "🔧", accent: "#378add", bg: "#e6f1fb", link: "/ordenes"  },
        { label: "Ingresos",  value: `$${stats.ganancias.toLocaleString()}`, icon: "💰", accent: "#ef9f27", bg: "#faeeda", link: "/facturas" },
        { label: "Usuarios",     value: stats.usuarios,                      icon: "🪪", accent: "#d4537e", bg: "#fbeaf0", link: "/usuarios" },
      ];
    } else if (rolUsuario === "mecanico") {
      return [
        { label: "Órdenes Activas", value: stats.ordenes, icon: "🔧", accent: "#378add", bg: "#e6f1fb", link: "/ordenes"  },
        { label: "Vehículos", value: "Ver", icon: "🏍", accent: "#00b96b", bg: "#e6faf2", link: "/motos" },
      ];
    } else {
      return [
        { label: "Mis Órdenes", value: stats.ordenes, icon: "📋", accent: "#378add", bg: "#e6f1fb", link: "/ordenes"  },
        { label: "Mis Facturas", value: stats.misFacturas, icon: "🧾", accent: "#ef9f27", bg: "#faeeda", link: "/facturas" },
        { label: "Mis Motos", value: "Ver", icon: "🏍", accent: "#00b96b", bg: "#e6faf2", link: "/motos" },
      ];
    }
  };

  const getRoleActions = () => {
    if (rolUsuario === "superadmin" || rolUsuario === "admin") {
      return QUICK_ACTIONS;
    } else if (rolUsuario === "mecanico") {
      return [
        { title: "Ver Órdenes", desc: "Revisar el estado de las motos en taller", icon: "🔧", to: "/ordenes", alert: false },
        { title: "Inventario", desc: "Consultar repuestos disponibles", icon: "📦", to: "#", alert: true },
      ];
    } else {
      return [
        { title: "Solicitar Recogida", desc: "Pide que recojamos tu moto en casa", icon: "🛵", to: "/ordenes", alert: false },
        { title: "Ver Facturas", desc: "Descarga los recibos de tus pagos", icon: "🧾", to: "/facturas", alert: false },
        { title: "Registrar Moto", desc: "Añade un nuevo vehículo a tu cuenta", icon: "🏍", to: "/motos", alert: false },
      ];
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroBadge}>{rolUsuario.toUpperCase()}</div>
          <h1 style={styles.heroTitle}>
            Bienvenido a <span style={{ color: "#00e88f" }}>MotoTech</span>
          </h1>
          <p style={styles.heroSub}>
            Mantenimiento y gestión de motos en Mocoa, Putumayo
          </p>
        </div>
        <div style={styles.heroDecor} />
      </div>

      <div style={styles.container}>

        {/* ESTADÍSTICAS */}
        <section style={styles.section}>
          <div style={styles.sectionLabel}>Resumen general</div>
          <div style={styles.statsGrid}>
            {getRoleStats().map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </section>

        {/* ACCIONES RÁPIDAS */}
        <section style={styles.section}>
          <div style={styles.sectionLabel}>Acciones rápidas</div>
          <div style={styles.actionsGrid}>
            {getRoleActions().map((a) => (
              <ActionCard key={a.title} {...a} />
            ))}
          </div>
        </section>

        {/* MAPA */}
        <section style={{ ...styles.section, paddingBottom: 40 }}>
          <div style={styles.sectionLabel}>Sede principal</div>
          <div style={styles.mapCard}>
            <div style={styles.mapEmbed}>
              <iframe
                title="Sede MotoTech"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                src={mapUrl}
                allowFullScreen
              />
            </div>
            <div style={styles.mapInfo}>
              <div style={styles.mapIconBig}>📍</div>
              <h3 style={styles.mapTitle}>Sede Principal</h3>
              <p style={styles.mapAddress}>{direccionTaller}</p>

              <div style={styles.mapDivider} />

              <div style={styles.mapDetail}>
                <span style={styles.mapDetailIcon}>🕗</span>
                <span>Lun – Sáb, 8:00 AM – 6:00 PM</span>
              </div>
              <div style={styles.mapDetail}>
                <span style={styles.mapDetailIcon}>📞</span>
                <span>+57 3XX XXX XXXX</span>
              </div>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(direccionTaller)}`}
                target="_blank"
                rel="noreferrer"
                style={styles.mapBtn}
              >
                ¿Cómo llegar? →
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "transparent",
    minHeight: "100vh",
  },
  hero: {
    background: "linear-gradient(180deg, rgba(18, 17, 15, 0.85) 0%, rgba(18, 17, 15, 0.65) 100%)",
    borderBottom: "1px solid var(--border-color)",
    padding: "56px 24px 72px",
    position: "relative",
    overflow: "hidden",
  },
  heroInner: {
    maxWidth: 960,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  heroBadge: {
    display: "inline-block",
    background: "linear-gradient(135deg, rgba(229, 193, 88, 0.2) 0%, rgba(229, 193, 88, 0.1) 100%)",
    color: "var(--accent-orange)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.15em",
    padding: "6px 14px",
    borderRadius: 4,
    marginBottom: 16,
    border: "1px solid rgba(229, 193, 88, 0.3)",
    fontFamily: "var(--font-tech)",
    boxShadow: "0 0 20px rgba(229, 193, 88, 0.15)",
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: 800,
    color: "#fff",
    margin: "0 0 12px",
    letterSpacing: "1px",
    fontFamily: "var(--font-tech)",
    textShadow: "0 0 30px rgba(229, 193, 88, 0.2)",
  },
  heroSub: {
    fontSize: 16,
    color: "var(--text-secondary)",
    margin: 0,
    fontFamily: "var(--font-display)",
    letterSpacing: "0.3px",
  },
  heroDecor: {
    position: "absolute",
    right: -80,
    top: -80,
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(229, 193, 88, 0.05) 0%, transparent 70%)",
    border: "1px solid rgba(229, 193, 88, 0.08)",
    pointerEvents: "none",
    animation: "pulse 4s ease-in-out infinite",
  },
  container: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "0 24px",
    marginTop: -28,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--accent-orange)",
    letterSpacing: "0.15em",
    marginBottom: 14,
    textTransform: "uppercase",
    fontFamily: "var(--font-tech)",
  },

  /* STAT CARDS */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
  },
  statCard: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: 0,
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    position: "relative",
    overflow: "hidden",
    transition: "all 0.25s ease",
    cursor: "pointer",
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: "1px solid rgba(255,255,255,0.05)",
  },
  statValue: {
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1,
    marginBottom: 4,
    fontFamily: "var(--font-tech)",
  },
  statLabel: {
    fontSize: 12,
    color: "var(--text-secondary)",
    fontWeight: 500,
  },
  statAccentBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },

  /* ACTION CARDS */
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },
  actionCard: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: 0,
    padding: "24px 20px",
    transition: "all 0.25s ease",
    cursor: "pointer",
    position: "relative",
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 14,
    display: "block",
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#fff",
    marginBottom: 6,
    fontFamily: "var(--font-tech)",
  },
  actionDesc: {
    fontSize: 13,
    color: "var(--text-secondary)",
    lineHeight: 1.5,
    marginBottom: 16,
  },
  actionArrow: {
    fontSize: 14,
    color: "var(--accent-orange)",
    fontWeight: 600,
  },

  /* MAP */
  mapCard: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: 0,
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  },
  mapEmbed: {
    height: 360,
  },
  mapInfo: {
    background: "rgba(10, 11, 14, 0.95)",
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
  },
  mapIconBig: {
    fontSize: 24,
    marginBottom: 10,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#fff",
    margin: "0 0 8px",
    fontFamily: "var(--font-tech)",
  },
  mapAddress: {
    fontSize: 13,
    color: "var(--text-secondary)",
    lineHeight: 1.6,
    margin: 0,
  },
  mapDivider: {
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    margin: "20px 0",
  },
  mapDetail: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
    color: "var(--text-secondary)",
    marginBottom: 10,
  },
  mapDetailIcon: {
    fontSize: 14,
  },
  mapBtn: {
    marginTop: "auto",
    display: "inline-block",
    background: "rgba(255, 95, 0, 0.15)",
    color: "var(--accent-orange)",
    border: "1px solid var(--accent-orange)",
    borderRadius: 0,
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 600,
    textDecoration: "none",
    textAlign: "center",
    fontFamily: "var(--font-tech)",
  },
};

export default Dashboard;