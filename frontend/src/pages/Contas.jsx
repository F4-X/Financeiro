import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Contas() {
  const [usuarios, setUsuarios] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    perfil: "comum"
  });

  async function carregarUsuarios() {
    const { data } = await api.get("/contas");
    setUsuarios(data);
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  function alterarCampo(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function cadastrarUsuario(e) {
    e.preventDefault();

    await api.post("/contas", form);

    setForm({
      nome: "",
      email: "",
      senha: "",
      perfil: "comum"
    });

    carregarUsuarios();
  }

  async function excluirUsuario(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este usuário?"
    );

    if (!confirmar) return;

    await api.delete(`/contas/${id}`);

    carregarUsuarios();
  }

  return (
    <div>
      <h1 className="page-title">Contas de usuários</h1>

      <p className="subtitle">
        Área administrativa para criar e gerenciar usuários comuns.
      </p>

      <div className="panel">
        <form onSubmit={cadastrarUsuario}>
          <div className="grid-2">
            <div>
              <label>Nome</label>
              <input
                name="nome"
                value={form.nome}
                onChange={alterarCampo}
                placeholder="Nome do usuário"
                required
              />
            </div>

            <div>
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={alterarCampo}
                placeholder="email@exemplo.com"
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label>Senha</label>
              <input
                name="senha"
                type="password"
                value={form.senha}
                onChange={alterarCampo}
                placeholder="Senha inicial"
                required
              />
            </div>

            <div>
              <label>Tipo de conta</label>
              <select
                name="perfil"
                value={form.perfil}
                onChange={alterarCampo}
              >
                <option value="comum">Comum</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          <div className="top-actions">
            <button type="submit">
              + Criar conta
            </button>
          </div>
        </form>
      </div>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>NOME</th>
              <th>EMAIL</th>
              <th>TIPO</th>
              <th>AÇÕES</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>

                <td>
                  <span
                    className={
                      usuario.perfil === "admin"
                        ? "badge-admin"
                        : "badge-user"
                    }
                  >
                    {usuario.perfil === "admin"
                      ? "Administrador"
                      : "Comum"}
                  </span>
                </td>

                <td>
                  <button
                    className="danger-btn"
                    onClick={() => excluirUsuario(usuario.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {usuarios.length === 0 && (
              <tr>
                <td colSpan="4">
                  Nenhum usuário cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}