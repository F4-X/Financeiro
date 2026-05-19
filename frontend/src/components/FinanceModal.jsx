import { useState } from "react";
import { api } from "../services/api";

export default function FinanceModal({ tipo, onClose, dadosEdicao }) {
  const [itens, setItens] = useState(
    dadosEdicao?.itens?.length
      ? dadosEdicao.itens
      : [{ nome: "", valor: "" }]
  );

  const [form, setForm] = useState({
    data: dadosEdicao?.vencimento
      ? dadosEdicao.vencimento.split("T")[0]
      : "",
    nome: dadosEdicao?.descricao || "",
    descricao: dadosEdicao?.descricao || "",
    categoria: dadosEdicao?.observacao || "",
    valor: dadosEdicao?.valor || ""
  });

  function alterarCampo(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function alterarItem(index, campo, valor) {
    const novosItens = [...itens];

    novosItens[index] = {
      ...novosItens[index],
      [campo]: valor
    };

    setItens(novosItens);
  }

  function adicionarItem() {
    setItens([
      ...itens,
      { nome: "", valor: "" }
    ]);
  }

  async function salvar() {
    const rota = tipo === "Pagar" ? "/pagar" : "/receber";

    const payload = {
      descricao: form.descricao || form.nome,
      valor: Number(form.valor),
      vencimento: form.data,
      observacao: form.categoria,
      itens: itens.filter(item => item.nome || item.valor)
    };

    if (dadosEdicao) {
      await api.put(`${rota}/${dadosEdicao.id}`, payload);
    } else {
      await api.post(rota, payload);
    }

    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="finance-modal">
        <div className="modal-header">
          <h2>
            {dadosEdicao ? "Editar" : "Novo"} {tipo.toLowerCase()}
          </h2>
        </div>

        <div className="grid-2">
          <div>
            <label>Tipo</label>
            <select disabled>
              <option>{tipo}</option>
            </select>
          </div>

          <div>
            <label>Data</label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={alterarCampo}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Cliente/Fornecedor</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={alterarCampo}
          />
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <textarea
            rows="4"
            name="descricao"
            value={form.descricao}
            onChange={alterarCampo}
          />
        </div>

        <div className="grid-2">
          <div>
            <label>Categoria</label>
            <input
              type="text"
              name="categoria"
              value={form.categoria}
              onChange={alterarCampo}
            />
          </div>

          <div>
            <label>Valor total</label>
            <input
              type="number"
              name="valor"
              placeholder="0.00"
              value={form.valor}
              onChange={alterarCampo}
            />
          </div>
        </div>

        {tipo === "Pagar" && (
          <label className="upload-box">
            📎 Anexar imagem ou PDF da conta
            <input type="file" accept="image/*,.pdf" hidden />
          </label>
        )}

        <div className="items-title">
          <h3>Itens</h3>
        </div>

        {itens.map((item, index) => (
          <div className="item-row" key={index}>
            <input
              placeholder="Item"
              value={item.nome}
              onChange={e =>
                alterarItem(index, "nome", e.target.value)
              }
            />

            <input
              placeholder="Valor"
              type="number"
              value={item.valor}
              onChange={e =>
                alterarItem(index, "valor", e.target.value)
              }
            />
          </div>
        ))}

        <button className="add-item-btn" onClick={adicionarItem}>
          + adicionar item
        </button>

        <div className="modal-actions">
          <button className="secondary" onClick={onClose}>
            Cancelar
          </button>

          <button onClick={salvar}>
            {dadosEdicao ? "Salvar edição" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}