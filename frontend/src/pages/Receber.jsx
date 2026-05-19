import { useEffect, useState } from "react";
import { api } from "../services/api";
import FinanceModal from "../components/FinanceModal";

export default function Receber() {
  const [open, setOpen] = useState(false);
  const [dados, setDados] = useState([]);
  const [editando, setEditando] = useState(null);
  const [recebendo, setRecebendo] = useState(null);
  const [valorParcial, setValorParcial] = useState("");

  async function carregar() {
    const { data } = await api.get("/receber");
    setDados(data);
  }

  async function excluir(id) {
    await api.delete(`/receber/${id}`);
    carregar();
  }

  async function confirmarRecebimento() {
    await api.patch(`/receber/${recebendo.id}/receber`, {
      valor: Number(valorParcial || 0)
    });

    setRecebendo(null);
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

  const recebido = dados.reduce(
    (soma, item) => soma + Number(item.valor_recebido || 0),
    0
  );

  const restante = total - recebido;

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

  function valorRecebidoItem(item) {
    return Number(item.valor_recebido || 0);
  }

  function valorTotalItem(item) {
    return Number(item.valor || 0);
  }

  function restanteItem(item) {
    return Math.max(valorTotalItem(item) - valorRecebidoItem(item), 0);
  }

  return (
    <div>
      <h1 className="page-title">Contas a receber</h1>

      <p className="subtitle">
        Listagem financeira com recebimentos parciais.
      </p>

      <div className="top-actions">
        <button
          onClick={() => {
            setEditando(null);
            setOpen(true);
          }}
        >
          + Adicionar recebimento
        </button>
      </div>

      <div className="cards">
        <div className="card">
          <span>Total</span>
          <strong>{formatar(total)}</strong>
        </div>

        <div className="card">
          <span>Recebido</span>
          <strong>{formatar(recebido)}</strong>
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
                    {formatar(valorRecebidoItem(item))} / {formatar(valorTotalItem(item))}
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
                    {item.status !== "recebido" && (
                      <button onClick={() => setRecebendo(item)}>
                        Receber
                      </button>
                    )}

                    <button onClick={() => editar(item)}>
                      Editar
                    </button>

                    <button
  className="danger-btn"
  onClick={() => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta conta?"
    );

    if (confirmar) {
      excluir(item.id);
    }
  }}
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

      {recebendo && (
        <div className="modal-overlay">
          <div className="finance-modal">
            <div className="modal-header">
              <h2>Registrar recebimento</h2>
            </div>

            <p className="subtitle">
              Total: {formatar(recebendo.valor)} <br />
              Recebido: {formatar(recebendo.valor_recebido)} <br />
              Restante: {formatar(restanteItem(recebendo))}
            </p>

            <div className="form-group">
              <label>Valor recebido agora</label>
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
                  setRecebendo(null);
                  setValorParcial("");
                }}
              >
                Cancelar
              </button>

              <button onClick={confirmarRecebimento}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <FinanceModal
          tipo="Receber"
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