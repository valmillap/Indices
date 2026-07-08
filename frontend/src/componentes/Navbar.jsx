import "./Navbar.css";

/**
 * Barra de navegación superior.
 * - Izquierda: pestañas de la app (Duplicados, Heap Lookup, etc).
 * - Derecha: BD activa + botón para cambiarla, sin salir de la pantalla.
 */
function Navbar({ tabs, tabActiva, onSeleccionar, conexion, onCambiarBD, onCerrarSesion }) {
  return (
    <nav className="navbar">
      <div className="navbar-marca">Índices</div>

      <ul className="navbar-tabs">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              className={
                "navbar-tab" + (tabActiva === tab.id ? " navbar-tab--activa" : "")
              }
              onClick={() => onSeleccionar(tab)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="navbar-conexion">
        {conexion ? (
          <>
            <span className="navbar-conexion-info">
              <span className="navbar-conexion-punto" />
              BD: <strong>{conexion.database}</strong>
            </span>
            <button className="navbar-btn-bd" onClick={onCambiarBD}>
              Cambiar BD
            </button>
            <button className="navbar-btn-cerrar-sesion" onClick={onCerrarSesion}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <button className="navbar-btn-bd" onClick={onCambiarBD}>
            Conectar BD
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
