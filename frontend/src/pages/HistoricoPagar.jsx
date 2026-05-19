import { useEffect, useState } from "react";
import { api } from "../services/api";
import Money from "../components/Money";

export default function HistoricoPagar() {
  const [lista, setLista] = useState([]);
  const [pesquisa, setPesquisa] = useState("");

  async function carregar() {
    const { data } = await api.get("/historico");

    setLista(
      data.filter(item => item.tipo === "pagar")
    );
  }

  useEffect(() => {
    carregar();
  }, []);

  const listaFiltrada = lista.filter(item => {
    const texto = pesquisa.toLowerCase();

    const descricao = String(
      item.descricao || ""
    ).toLowerCase();

    const valor = String(
      item.valor || ""
    ).toLowerCase();

    const valorFormatado = Number(
      item.valor || 0
    )
      .toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      })
      .toLowerCase();

    const data = new Date(
      item.data_movimento
    ).toLocaleDateString("pt-BR");

    return (
      descricao.includes(texto) ||
      valor.includes(texto) ||
      valorFormatado.includes(texto) ||
      data.includes(texto)
    );
  });

  return (
    <div>
      <h1 className="page-title">
        Histórico de pagamentos
      </h1>

      <p className="subtitle">
        Histórico de contas pagas.
      </p>

      <div className="panel">
        <label>Pesquisar</label>

        <input
          type="text"
          placeholder="Pesquisar por descrição, valor ou data..."
          value={pesquisa}
          onChange={e => setPesquisa(e.target.value)}
        />
      </div>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>DESCRIÇÃO</th>
              <th>VALOR</th>
              <th>DATA</th>
            </tr>
          </thead>

          <tbody>
            {listaFiltrada.map(item => (
              <tr key={item.id}>
                <td>{item.descricao}</td>

                <td>
                  <Money value={item.valor} />
                </td>

                <td>
                  {new Date(
                    item.data_movimento
                  ).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}