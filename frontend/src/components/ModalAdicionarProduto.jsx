import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ModalAdicionarProduto({ pedidoId, onClose, onProdutoAdicionado }) {
  const [estoque, setEstoque] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [busca, setBusca] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [valorUnitario, setValorUnitario] = useState(0);
  const [tipoPagamento, setTipoPagamento] = useState("integral");
  const [valorSinal, setValorSinal] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/api/estoque")
      .then(res => setEstoque(res.data))
      .catch(err => console.error("Erro ao buscar estoque:", err));
  }, []);

  const handleProdutoSelect = (produto) => {
    setProdutoSelecionado(produto);
    setValorUnitario(produto.valor);
    setBusca(produto.nome); // Mantém o nome visível no input
    setTimeout(() => setBusca(""), 200); // Oculta a lista após seleção
  };

  const handleSubmit = async () => {
    if (!produtoSelecionado) return alert("Selecione um produto");
    if (tipoPagamento === "sinal" && valorSinal <= 0) return alert("Informe valor do sinal");

    const item = {
      produto: produtoSelecionado.nome,
      quantidade,
      valorUnitario,
      pagamento: tipoPagamento,
      valorSinal: tipoPagamento === "sinal" ? valorSinal : valorUnitario * quantidade
    };

    try {
      const res = await axios.post(`http://localhost:5000/api/pedidos/${pedidoId}/itens`, item);
      onProdutoAdicionado(res.data);
      onClose();
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
      alert("Erro ao salvar item");
    }
  };

  const produtosFiltrados = estoque.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg p-4 w-full max-w-lg">
        <h2 className="text-lg font-bold mb-2">Adicionar Produto</h2>

        <label className="block mb-1 text-sm">Produto</label>
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          placeholder="Buscar no estoque..."
        />
        {busca.length > 0 && produtosFiltrados.length > 0 && (
          <ul className="border rounded mt-1 max-h-32 overflow-auto text-sm bg-white shadow">
            {produtosFiltrados.map(prod => (
              <li
                key={prod.id}
                className="p-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleProdutoSelect(prod)}
              >
                {prod.nome} – R$ {Number(prod.valor).toFixed(2)}
              </li>
            ))}
          </ul>
          
        )
        }

{produtoSelecionado && (
  <div className="mt-2 text-sm text-gray-700">
    Produto selecionado: <strong>{produtoSelecionado.nome}</strong>
  </div>
)}  
        <div className="flex gap-2 mt-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm">Quantidade</label>
            <input
              type="number"
              value={quantidade}
              onChange={e => setQuantidade(Number(e.target.value))}
              className="w-full border px-2 py-1 rounded"
              min="1"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sm">Valor Unitário</label>
            <input
              type="number"
              value={valorUnitario}
              onChange={e => setValorUnitario(Number(e.target.value))}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block mb-1 text-sm">Pagamento</label>
          <select
            value={tipoPagamento}
            onChange={e => setTipoPagamento(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="integral">Integral</option>
            <option value="sinal">Sinal + Restante</option>
          </select>
        </div>

        {tipoPagamento === "sinal" && (
          <div className="mt-2">
            <label className="block mb-1 text-sm">Valor do Sinal</label>
            <input
              type="number"
              value={valorSinal}
              onChange={e => setValorSinal(Number(e.target.value))}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200">Cancelar</button>
          <button onClick={handleSubmit} className="px-3 py-1 rounded bg-blue-600 text-white">Salvar</button>
        </div>
      </div>
    </div>
  );
}
