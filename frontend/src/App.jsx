import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./styles/global.css";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const usuario = {
    nome: "Admin",
    perfil: "admin"
  };

  return (
    <div className="app">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="logo">
            <div className="logo-icon">F</div>

            <div>
              <strong>FluxPay</strong>
              <small>
                {usuario.perfil === "admin" ? "Administrador" : "Usuário comum"}
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
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
          <NavLink to="/receber" onClick={() => setMenuOpen(false)}>Receber</NavLink>
          <NavLink to="/pagar" onClick={() => setMenuOpen(false)}>Pagar</NavLink>
          <NavLink to="/historico" onClick={() => setMenuOpen(false)}>Histórico</NavLink>

          {usuario.perfil === "admin" && (
            <NavLink to="/contas" onClick={() => setMenuOpen(false)}>Contas</NavLink>
          )}
        </nav>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}