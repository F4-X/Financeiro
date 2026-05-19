export default function Dashboard() {
  return (
    <div>
      <h1 className="page-title">Resumo financeiro</h1>

      <p className="subtitle">
        Visão geral da sua vida financeira.
      </p>

      <div className="cards">
        <div className="card">
          <span>Saldo total</span>
          <strong>R$ 29.167,00</strong>
        </div>

        <div className="card">
          <span>Total a pagar</span>
          <strong style={{ color: "#d62828" }}>
            R$ 8.400,00
          </strong>
        </div>

        <div className="card">
          <span>Total a receber</span>
          <strong style={{ color: "#00bd5e" }}>
            R$ 20.767,00
          </strong>
        </div>
      </div>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>DESCRIÇÃO</th>
              <th>TIPO</th>
              <th>VALOR</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Salário</td>
              <td>Receber</td>
              <td>R$ 5.000,00</td>
              <td style={{ color: "#00bd5e", fontWeight: "bold" }}>
                Recebido
              </td>
            </tr>

            <tr>
              <td>Aluguel</td>
              <td>Pagar</td>
              <td>R$ 1.500,00</td>
              <td style={{ color: "#d62828", fontWeight: "bold" }}>
                Pendente
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
