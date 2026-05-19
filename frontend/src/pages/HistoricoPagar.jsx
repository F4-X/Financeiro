import { useEffect, useState } from "react";
import { api } from "../services/api";
import Money from "../components/Money";

export default function HistoricoPagar() {
  const [lista, setLista] = useState([]);

  async function carregar() {
    const { data } = await api.get("/historico");

    setLista(
      data.filter(item => item.tipo === "pagar")
    );
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div>
      <h1 className="page-title">
        Histórico de pagamentos
      </h1>

      <p className="subtitle">
        Histórico de contas pagas.
      </p>

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
            {lista.map(item => (
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