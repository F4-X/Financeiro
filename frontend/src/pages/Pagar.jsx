import { useEffect, useState } from "react";
import { api } from "../services/api";
import FinanceModal from "../components/FinanceModal";

export default function Pagar() {
  const [open, setOpen] = useState(false);
  const [dados, setDados] = useState([]);

  async function carregar() {
    const { data } = await api.get("/pagar");
    setDados(data);
  }

  async function excluir(id) {
    await api.delete(`/pagar/${id}`);
    carregar();
  }

  async function marcarPago(id) {
    await api.patch(`/pagar/${id}/pagar`);
    carregar();
  }

  useEffect(() => {
    carregar();
  }, []);

  const total = dados.reduce((soma, item) => soma + Number(item.valor), 0);

  const pago = dados
    .filter(item => item.status === "pago")
    .reduce((soma, item) => soma + Number(item.valor), 0);

  const restante = total - pago;

  function formatar(valor) {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
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
          <strong>{formatar(total)}</strong>
        </div>

        <div className="card">
          <span>Pago</span>
          <strong>{formatar(pago)}</strong>
        </div>

        <div className="card">
          <span>Restante</span>
          <strong>{formatar(restante)}</strong>
        </div>
      </div>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>DESCRIÇÃO</th>
              <th>VALOR</th>
              <th>VENCIMENTO</th>
              <th>STATUS</th>
              <th>AÇÕES</th>
            </tr>
          </thead>

          <tbody>
            {dados.map(item => (
              <tr key={item.id}>
                <td>{item.descricao}</td>
                <td>{formatar(item.valor)}</td>
                <td>{new Date(item.vencimento).toLocaleDateString("pt-BR")}</td>
                <td>{item.status}</td>

                <td>
                  <div className="actions">
                    {item.status === "pendente" && (
                      <button onClick={() => marcarPago(item.id)}>
                        Pagar
                      </button>
                    )}

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
          onClose={() => {
            setOpen(false);
            carregar();
          }}
        />
      )}
    </div>
  );
}