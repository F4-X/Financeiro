import { useState } from "react";

export default function Contas() {
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: "Administrador",
      email: "admin@email.com",
      perfil: "admin"
    },
    {
      id: 2,
      nome: "Usuário comum",
      email: "usuario@email.com",
      perfil: "comum"
    }
  ]);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    perfil: "comum"
  });

  function alterarCampo(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function cadastrarUsuario(e) {
    e.preventDefault();

    const novoUsuario = {
      id: Date.now(),
      nome: form.nome,
      email: form.email,
      perfil: form.perfil
    };

    setUsuarios([...usuarios, novoUsuario]);

    setForm({
      nome: "",
      email: "",
      senha: "",
      perfil: "comum"
    });
  }

  function excluirUsuario(id) {
    setUsuarios(usuarios.filter(usuario => usuario.id !== id));
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
          </tbody>
        </table>
      </div>
    </div>
  );
}