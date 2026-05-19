import { useState } from "react";
import FinanceModal from "../components/FinanceModal";

export default function Receber() {

  const [open, setOpen] = useState(false);

  const [dados, setDados] = useState([
    {
      id: 1,
      nome: "Cliente 1",
      total: "R$ 500,00",
      recebido: "R$ 100,00",
      restante: "R$ 400,00"
    },

    {
      id: 2,
      nome: "Cliente 2",
      total: "R$ 900,00",
      recebido: "R$ 300,00",
      restante: "R$ 600,00"
    }
  ]);

  function excluir(id) {
    setDados(
      dados.filter(item => item.id !== id)
    );
  }

  return (
    <div>

      <h1 className="page-title">
        Contas a receber
      </h1>

      <p className="subtitle">
        Listagem financeira com pagamentos parciais.
      </p>

      <div className="top-actions">

        <button onClick={() => setOpen(true)}>
          + Adicionar recebimento
        </button>

      </div>

      <div className="cards">

        <div className="card">
          <span>Total</span>
          <strong>R$ 29.167,00</strong>
        </div>

        <div className="card">
          <span>Recebido</span>
          <strong>R$ 334,00</strong>
        </div>

        <div className="card">
          <span>Restante</span>
          <strong>R$ 28.833,00</strong>
        </div>

      </div>

      <div className="table-box">

        <table>

          <thead>
            <tr>
              <th>NOME</th>
              <th>TOTAL</th>
              <th>RECEBIDO</th>
              <th>RESTANTE</th>
              <th>AÇÕES</th>
            </tr>
          </thead>

          <tbody>

            {dados.map(item => (

              <tr key={item.id}>

                <td>{item.nome}</td>

                <td>{item.total}</td>

                <td>{item.recebido}</td>

                <td className="value-orange">
                  {item.restante}
                </td>

                <td>

                  <div className="actions">

                    <button>
                      Receber
                    </button>

                    <button
                      className="danger-btn"
                      onClick={() => excluir(item.id)}
                    >
                      Excluir
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {open && (
        <FinanceModal
          tipo="Receber"
          onClose={() => setOpen(false)}
        />
      )}

    </div>
  );
}