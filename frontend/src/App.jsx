import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./styles/global.css";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    return null;
  }

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href = "/login";
  }

  return (
    <div className="app">

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>

        <div className="sidebar-top">

          <div className="logo">

            <div className="logo-icon">
              F
            </div>

            <div>
              <strong>FluxPay</strong>

              <small>
                {usuario?.perfil === "admin"
                  ? "Administrador"
                  : "Usuário comum"}
              </small>
            </div>

          </div>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

        </div>

        <nav className="menu">

          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/receber"
            onClick={() => setMenuOpen(false)}
          >
            Receber
          </NavLink>

          <NavLink
            to="/pagar"
            onClick={() => setMenuOpen(false)}
          >
            Pagar
          </NavLink>

          <NavLink
            to="/historico"
            onClick={() => setMenuOpen(false)}
          >
            Histórico
          </NavLink>

          {usuario?.perfil === "admin" && (
            <NavLink
              to="/contas"
              onClick={() => setMenuOpen(false)}
            >
              Contas
            </NavLink>
          )}

        </nav>

        <button
          className="danger-btn logout-btn"
          onClick={sair}
        >
          Sair
        </button>

      </aside>

      <main className="content">
        <Outlet />
      </main>

    </div>
  );
}