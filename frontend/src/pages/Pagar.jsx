import { useEffect, useState } from "react";
import { api } from "../services/api";
import FinanceModal from "../components/FinanceModal";

export default function Pagar() {
  const [open, setOpen] = useState(false);
  const [dados, setDados] = useState([]);
  const [editando, setEditando] = useState(null);
  const [pagando, setPagando] = useState(null);
  const [valorParcial, setValorParcial] = useState("");

  async function carregar() {
    const { data } = await api.get("/pagar");
    setDados(data);
  }

  async function excluir(id) {
    await api.delete(`/pagar/${id}`);
    carregar();
  }

  async function confirmarPagamento() {
    await api.patch(`/pagar/${pagando.id}/pagar`, {
      valor: Number(valorParcial || 0)
    });

    setPagando(null);
    setValorParcial("");
    carregar();
  }

  function editar(item) {
    setEditando(item);
    setOpen(true);
  }

  useEffect(() => {
    carregar();
  }, []);

  const total = dados.reduce(
    (soma, item) => soma + Number(item.valor || 0),
    0
  );

  const pago = dados.reduce(
    (soma, item) => soma + Number(item.valor_pago || 0),
    0
  );

  const restante = total - pago;

  function formatar(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function formatarData(data) {
    if (!data) return "-";

    return new Date(data).toLocaleDateString("pt-BR");
  }

  function valorPagoItem(item) {
    return Number(item.valor_pago || 0);
  }

  function valorTotalItem(item) {
    return Number(item.valor || 0);
  }

  function restanteItem(item) {
    return Math.max(valorTotalItem(item) - valorPagoItem(item), 0);
  }

  return (
    <div>
      <h1 className="page-title">Contas a pagar</h1>

      <p className="subtitle">
        Controle financeiro de despesas e pagamentos.
      </p>

      <div className="top-actions">
        <button
          onClick={() => {
            setEditando(null);
            setOpen(true);
          }}
        >
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
              <th>PROGRESSO</th>
              <th>VENCIMENTO</th>
              <th>STATUS</th>
              <th>AÇÕES</th>
            </tr>
          </thead>

          <tbody>
            {dados.map(item => (
              <tr key={item.id}>
                <td>{item.descricao || "-"}</td>

                <td>{formatar(item.valor)}</td>

                <td>
                  <strong>
                    {formatar(valorPagoItem(item))} / {formatar(valorTotalItem(item))}
                  </strong>
                  <br />
                  <small>
                    Restante: {formatar(restanteItem(item))}
                  </small>
                </td>

                <td>{formatarData(item.vencimento)}</td>

                <td>{item.status}</td>

                <td>
                  <div className="actions">
                    {item.status !== "pago" && (
                      <button onClick={() => setPagando(item)}>
                        Pagar
                      </button>
                    )}

                    <button onClick={() => editar(item)}>
                      Editar
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

      {pagando && (
        <div className="modal-overlay">
          <div className="finance-modal">
            <div className="modal-header">
              <h2>Registrar pagamento</h2>
            </div>

            <p className="subtitle">
              Total: {formatar(pagando.valor)} <br />
              Pago: {formatar(pagando.valor_pago)} <br />
              Restante: {formatar(restanteItem(pagando))}
            </p>

            <div className="form-group">
              <label>Valor pago agora</label>
              <input
                type="number"
                placeholder="0.00"
                value={valorParcial}
                onChange={e => setValorParcial(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button
                className="secondary"
                onClick={() => {
                  setPagando(null);
                  setValorParcial("");
                }}
              >
                Cancelar
              </button>

              <button onClick={confirmarPagamento}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <FinanceModal
          tipo="Pagar"
          dadosEdicao={editando}
          onClose={() => {
            setOpen(false);
            setEditando(null);
            carregar();
          }}
        />
      )}
    </div>
  );
}