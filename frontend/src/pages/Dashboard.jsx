import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Dashboard() {
  const [pagar, setPagar] = useState([]);
  const [receber, setReceber] = useState([]);

  async function carregar() {
    const pagarResponse = await api.get("/pagar");
    const receberResponse = await api.get("/receber");

    setPagar(pagarResponse.data);
    setReceber(receberResponse.data);
  }

  useEffect(() => {
    carregar();
  }, []);

  function formatar(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

function dataBR(data) {
  if (!data) return "";

  const somenteData = String(data).split("T")[0];
  const [ano, mes, dia] = somenteData.split("-");

  return `${dia}/${mes}/${ano}`;
}
  function restantePagar(item) {
    return Math.max(
      Number(item.valor || 0) - Number(item.valor_pago || 0),
      0
    );
  }

  function restanteReceber(item) {
    return Math.max(
      Number(item.valor || 0) - Number(item.valor_recebido || 0),
      0
    );
  }

  function valorRestante(item) {
    return item.tipo === "Pagar"
      ? restantePagar(item)
      : restanteReceber(item);
  }

  const hoje = new Date().toLocaleDateString("pt-BR");

  const pagarHoje = pagar.filter(item =>
    dataBR(item.vencimento) === hoje
  );

  const receberHoje = receber.filter(item =>
    dataBR(item.vencimento) === hoje
  );

  const contasHoje = [
    ...pagarHoje.map(item => ({
      ...item,
      tipo: "Pagar"
    })),
    ...receberHoje.map(item => ({
      ...item,
      tipo: "Receber"
    }))
  ];

  const totalPagar = pagar.reduce(
    (soma, item) => soma + restantePagar(item),
    0
  );

  const totalReceber = receber.reduce(
    (soma, item) => soma + restanteReceber(item),
    0
  );

  const totalDiaPagar = pagarHoje.reduce(
    (soma, item) => soma + restantePagar(item),
    0
  );

  const totalDiaReceber = receberHoje.reduce(
    (soma, item) => soma + restanteReceber(item),
    0
  );

  return (
    <div>
      <h1 className="page-title">Resumo financeiro</h1>

      <p className="subtitle">
        Visão geral da sua vida financeira.
      </p>

      <div className="cards">
        <div className="card">
          <span>Contas do dia</span>
          <strong>{contasHoje.length}</strong>
        </div>

        <div className="card">
          <span>Total a pagar restante</span>
          <strong style={{ color: "#d62828" }}>
            {formatar(totalPagar)}
          </strong>
        </div>

        <div className="card">
          <span>Total a receber restante</span>
          <strong style={{ color: "#00bd5e" }}>
            {formatar(totalReceber)}
          </strong>
        </div>
      </div>

      <div className="cards">
        <div className="card">
          <span>Pagar hoje restante</span>
          <strong style={{ color: "#d62828" }}>
            {formatar(totalDiaPagar)}
          </strong>
        </div>

        <div className="card">
          <span>Receber hoje restante</span>
          <strong style={{ color: "#00bd5e" }}>
            {formatar(totalDiaReceber)}
          </strong>
        </div>

        <div className="card">
          <span>Resultado do dia</span>
          <strong>
            {formatar(totalDiaReceber - totalDiaPagar)}
          </strong>
        </div>
      </div>

      <h2 className="items-title">Contas de hoje</h2>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>DESCRIÇÃO</th>
              <th>TIPO</th>
              <th>VALOR TOTAL</th>
              <th>RESTANTE</th>
              <th>VENCIMENTO</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {contasHoje.length === 0 && (
              <tr>
                <td colSpan="6">
                  Nenhuma conta para hoje.
                </td>
              </tr>
            )}

            {contasHoje.map(item => (
              <tr key={`${item.tipo}-${item.id}`}>
                <td>{item.descricao || "-"}</td>
                <td>{item.tipo}</td>
                <td>{formatar(item.valor)}</td>
                <td>{formatar(valorRestante(item))}</td>
                <td>{dataBR(item.vencimento)}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}