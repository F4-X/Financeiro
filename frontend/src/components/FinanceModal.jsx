import { useState } from "react";

export default function FinanceModal({ tipo, onClose }) {
  const [itens, setItens] = useState([
    { nome: "", valor: "" }
  ]);

  function adicionarItem() {
    setItens([
      ...itens,
      { nome: "", valor: "" }
    ]);
  }

  return (
    <div className="modal-overlay">
      <div className="finance-modal">
        <div className="modal-header">
          <h2>Novo {tipo.toLowerCase()}</h2>
        </div>

        <div className="grid-1">
          <div>
            <label>Data</label>
            <input type="date" />
          </div>
        </div>

        <div className="form-group">
          <label>Cliente/Fornecedor</label>
          <input type="text" />
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <textarea rows="4"></textarea>
        </div>

        <div className="grid-2">
          <div>
            <label>Categoria</label>
            <input type="text" />
          </div>

          <div>
            <label>Valor total</label>
            <input type="number" placeholder="0.00" />
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
            <input placeholder="Item" />
            <input placeholder="Valor" type="number" />
          </div>
        ))}

        <button className="add-item-btn" onClick={adicionarItem}>
          + adicionar item
        </button>

        <div className="modal-actions">
          <button className="secondary" onClick={onClose}>
            Cancelar
          </button>

          <button>Salvar</button>
        </div>
      </div>
    </div>
  );
}