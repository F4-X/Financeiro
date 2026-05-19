import { useState } from "react";
import { api } from "../services/api";

export default function FinanceModal({ tipo, onClose }) {

  const [itens, setItens] = useState([
    { nome: "", valor: "" }
  ]);

  const [form, setForm] = useState({
    data: "",
    nome: "",
    descricao: "",
    categoria: "",
    valor: ""
  });

  function alterarCampo(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function adicionarItem() {
    setItens([
      ...itens,
      { nome: "", valor: "" }
    ]);
  }

  async function salvar() {

    const rota =
      tipo === "Pagar"
        ? "/pagar"
        : "/receber";

    await api.post(rota, {
      descricao:
        form.descricao || form.nome,

      valor: Number(form.valor),

      vencimento: form.data,

      observacao:
        form.categoria
    });

    onClose();
  }

  return (
    <div className="modal-overlay">

      <div className="finance-modal">

        <div className="modal-header">
          <h2>
            Novo {tipo.toLowerCase()}
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

          <label>
            Cliente/Fornecedor
          </label>

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
            <input
              type="file"
              accept="image/*,.pdf"
              hidden
            />
          </label>
        )}

        <div className="items-title">
          <h3>Itens</h3>
        </div>

        {itens.map((item, index) => (

          <div
            className="item-row"
            key={index}
          >

            <input placeholder="Item" />

            <input
              placeholder="Valor"
              type="number"
            />

          </div>

        ))}

        <button
          className="add-item-btn"
          onClick={adicionarItem}
        >
          + adicionar item
        </button>

        <div className="modal-actions">

          <button
            className="secondary"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button onClick={salvar}>
            Salvar
          </button>

        </div>

      </div>

    </div>
  );
}