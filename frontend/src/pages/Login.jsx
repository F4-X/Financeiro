import { useState } from "react";
import { api } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    senha: ""
  });

  async function entrar(e) {
    e.preventDefault();

    const { data } = await api.post("/auth/login", form);

    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    window.location.href = "/";
  }

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={entrar}>
        <h1>FluxPay</h1>
        <p>Entre na sua conta</p>

        <input
          type="email"
          placeholder="E-mail"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={e => setForm({ ...form, senha: e.target.value })}
        />

        <button>Entrar</button>
      </form>
    </div>
  );
}