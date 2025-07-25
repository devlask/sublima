import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';



export default function VendaListaCompleta() {
  const [vendas, setVendas] = useState([]);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const navigate = useNavigate();
const abrirVendaComModal = () => {
  navigate('/pdv/venda?abrirModal=1');
};


  

  useEffect(() => {
    axios.get("http://localhost:5000/api/vendas")
      .then(res => setVendas(res.data))
      .catch(err => console.error("Erro ao buscar vendas:", err));
  }, []);

  const deletarVenda = async (id) => {
    if (window.confirm("Deseja excluir esta venda?")) {
      try {
        await axios.delete(`http://localhost:5000/api/vendas/${id}`);
        setVendas(prev => prev.filter(v => v.id !== id));
      } catch (err) {
        console.error("Erro ao excluir venda:", err);
      }
    }
  };

  const atualizarStatusPedido = async (id, novoStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/vendas/${id}/status`, { status: novoStatus });
      setVendas(prev =>
        prev.map(v =>
          v.id === id ? { ...v, status_pedido: novoStatus } : v
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar status do pedido:", err);
      alert("Erro ao atualizar status do pedido.");
    }
  };

  const vendasFiltradas = vendas.filter(venda => {
    const cliente = (venda.cliente || "").toLowerCase();
    const statusPedido = (venda.status_pedido || "").toLowerCase();
    const buscaLower = busca.toLowerCase();

    return (
      (cliente.includes(buscaLower) ||
        venda.itens?.some(i => (i.produto?.nome || '').toLowerCase().includes(buscaLower)))
      && (statusFiltro ? statusPedido === statusFiltro : true)
    );
  });

  return (
    <div className="w-full bg-white rounded-md shadow text-sm font-sans">
      {/* Filtros e Header */}
      <div className="flex flex-wrap items-center gap-2 p-2 border-b bg-[#f5f7fa]">
        <button className="text-blue-600 px-2 py-1">📋 Lista</button>

        <div className="ml-auto flex gap-2 items-center">
          <input
            className="border rounded px-2 py-1"
            placeholder="Cliente ou Produto"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <select
            className="border rounded px-2 py-1"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            <option value="">Todos os Status</option>
            <option value="arte">🎨 Arte</option>
            <option value="produção">⚙️ Produção</option>
            <option value="expedição">🚚 Expedição</option>
            <option value="entregue">✅ Entregue</option>
          </select>
          
        </div>
      </div>

      {/* Lista de Vendas */}
      <div className="divide-y">
        {vendasFiltradas.map((venda) => (
          <div key={venda.id} className="bg-slate-200  border-b p-3">
            <div className="flex flex-wrap gap-4 justify-between items-start text-xs bg-white border-b p-3 rounded-md shadow-sm">
                  {/* ID da Venda */}
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-100 rounded px-2 py-1 font-semibold text-sm">#{venda.id}</span>
                  </div>

                  {/* Infos do Cliente + Contato */}
                  <div className="flex flex-col text-xs min-w-[160px]">
                    <span><strong>Cliente:</strong> {venda.cliente || "Não informado"}</span>
                    <span><strong>Telefone:</strong> 📞 {venda.telefone || "Não informado"}</span>
                  </div>

                  {/* Datas: Criado + Entrega */}
                  <div className="flex flex-col text-xs min-w-[160px]">
                    <span><strong>Criado:</strong> 🗓️ {venda.created_at ? new Date(venda.created_at).toLocaleDateString() : "-"}</span>
                    <span><strong>Entrega:</strong> 🚚 {venda.data_entrega ? new Date(venda.data_entrega).toLocaleDateString() : "Não definida"}</span>
                  </div>

                  {/* Pagamento */}
                  <div className="flex items-center gap-2 min-w-[200px]">
                    <span className={`inline-block w-3 h-3 rounded-full ${venda.valor_restante <= 0 ? "bg-green-500" : "bg-orange-400"}`} title={(venda.valor_restante || 0) <= 0 ? "Pago integral" : "Pagamento pendente"}></span>
                    <span>
                      <strong>Pagamento:</strong> recebido R$ {parseFloat(venda.valor_recebido || 0).toFixed(2)}, falta R$ {parseFloat(venda.valor_restante || 0).toFixed(2)}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="text-xs font-bold text-teal-700">
                    💰 Total: R$ {parseFloat(venda.total).toFixed(2)}
                  </div>

                  {/* Status do Pedido */}
                  <select
                    value={venda.status_pedido || ""}
                    onChange={e => atualizarStatusPedido(venda.id, e.target.value)}
                    className="border rounded px-2 py-1 text-xs bg-white"
                  >
                    <option value="">📦 Status do Pedido</option>
                    <option value="arte">🎨 Arte</option>
                    <option value="produção">⚙️ Produção</option>
                    <option value="expedição">🚚 Expedição</option>
                    <option value="entregue">✅ Entregue</option>
                  </select>

                  {/* Ações */}
                  <div className="flex gap-1">
                    <button className="text-blue-600 text-sm">✏️</button>
                    <button
                      className="text-purple-600 text-sm"
                      onClick={() => window.open(`http://localhost:5000/api/vendas/${venda.id}/recibo`, '_blank')}
                    >🧾 Recibo</button>
                    <button
                      className="text-red-600 text-sm"
                      onClick={() => deletarVenda(venda.id)}
                    >🗑️</button>
                  </div>
                </div>

            {/* Itens da Venda */}
<div className="mt-2 bg-gray-50 rounded px-4 py-2 text-xs">
  {venda.itens.map(item => (
    <div key={item.id} className="py-0.5 border-b border-dashed last:border-0">
      <div className="flex justify-between">
        <span>{item.quantidade}x {item.produto?.nome || `Produto ${item.produto_id}`}</span>
        <span className="text-right">
          R$ {(Number(item.subtotal) || (item.quantidade * item.valor_unitario)).toFixed(2)}
        </span>
      </div>
    </div>
  ))}
  <div className="flex justify-between items-start text-[12px] text-gray-600 mt-2">
    {/* Observação da venda, canto esquerdo */}
    <div className="italic">
      {venda.obs && (
        <>
          📝 <strong>Obs:</strong> {venda.obs}
        </>
      )}
    </div>

    {/* Subtotal, canto direito */}
    <div className="text-right text-gray-700 font-medium">
      Subtotal: R$ {parseFloat(venda.total).toFixed(2)}
    </div>
  </div>
</div>
          </div>
        ))}
      </div>

      {/* Rodapé */}
      <div className="flex items-center justify-between border-t px-4 py-2 text-xs">
        <span className="font-semibold">
          Total de Vendas: {vendasFiltradas.length}
        </span>
        <div className="flex items-center gap-1">
          <select className="border rounded px-1 py-0.5 text-xs">
            <option>10</option>
            <option>20</option>
          </select>
          <button className="px-1">«</button>
          <button className="px-1">‹</button>
          <span className="border px-2 rounded text-blue-600">1</span>
          <button className="px-1">›</button>
          <button className="px-1">»</button>
        </div>
      </div>
    </div>
  );
}
