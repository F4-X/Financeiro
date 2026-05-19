import { useState } from "react";
import FinanceModal from "../components/FinanceModal";

export default function Pagar() {
  const [open, setOpen] = useState(false);

  const [dados, setDados] = useState([
    {
      id: 1,
      nome: "Aluguel",
      total: "R$ 1.500,00",
      pago: "R$ 1.500,00",
      restante: "R$ 0,00",
      quitado: true
    },
    {
      id: 2,
      nome: "Internet",
      total: "R$ 250,00",
      pago: "R$ 0,00",
      restante: "R$ 250,00",
      quitado: false
    },
    {
      id: 3,
      nome: "Energia",
      total: "R$ 890,00",
      pago: "R$ 300,00",
      restante: "R$ 590,00",
      quitado: false
    }
  ]);

  function excluir(id) {
    setDados(dados.filter(item => item.id !== id));
  }

  return (
    <div>
      <h1 className="page-title">Contas a pagar</h1>

      <p className="subtitle">
        Controle financeiro de despesas e pagamentos.
      </p>

      <div className="top-actions">
        <button onClick={() => setOpen(true)}>
          + Adicionar pagamento
        </button>
      </div>

      <div className="cards">
        <div className="card">
          <span>Total</span>
          <strong>R$ 12.450,00</strong>
        </div>

        <div className="card">
          <span>Pago</span>
          <strong>R$ 3.200,00</strong>
        </div>

        <div className="card">
          <span>Restante</span>
          <strong>R$ 9.250,00</strong>
        </div>
      </div>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>NOME</th>
              <th>TOTAL</th>
              <th>PAGO</th>
              <th>RESTANTE</th>
              <th>AÇÕES</th>
            </tr>
          </thead>

          <tbody>
            {dados.map(item => (
              <tr key={item.id}>
                <td>{item.nome}</td>
                <td>{item.total}</td>
                <td>{item.pago}</td>

                <td className={item.quitado ? "value-green" : "value-orange"}>
                  {item.restante}
                </td>

                <td>
                  <div className="actions">
                    <button>Pagar</button>

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
          tipo="Pagar"
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}