import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TelaPDVVenda() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [busca, setBusca] = useState('');
  const [modalPagamento, setModalPagamento] = useState(false);
  const [pagamento, setPagamento] = useState({ metodo: '', recebido: 0 });
  const [vendaFinalizada, setVendaFinalizada] = useState(false);
  const [cliente, setCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [revenda, setRevenda] = useState(false);
  const [totalManual, setTotalManual] = useState(0);
  const [observacao, setObservacao] = useState('');

  const navigate = useNavigate();

  const caixaSelecionado = JSON.parse(localStorage.getItem('caixaSelecionado'));

  useEffect(() => {
    axios.get('http://localhost:5000/api/estoque')
      .then(res => setProdutos(res.data))
      .catch(err => console.error('Erro ao buscar produtos:', err));
  }, []);

  const adicionarProduto = (produto) => {
  const valorNumerico = Number(produto.valor);
  if (isNaN(valorNumerico)) {
    console.error(`Valor inválido para o produto "${produto.nome}":`, produto.valor);
    return;
  }

  setCarrinho(prev => {
    const existente = prev.find(item => item.id === produto.id);
    if (existente) {
      return prev.map(item =>
        item.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      );
    } else {
      return [...prev, { ...produto, quantidade: 1, valor: valorNumerico }];
    }
  });
};


  const removerProduto = (id) => {
    setCarrinho(prev => prev.filter(item => item.id !== id));
  };

  const alterarQuantidade = (id, quantidade) => {
    setCarrinho(prev => prev.map(item =>
      item.id === id ? { ...item, quantidade: quantidade > 0 ? quantidade : 1 } : item
    ));
  };

const total = carrinho.reduce((acc, item) => acc + item.valor * item.quantidade, 0);
  const troco = pagamento.recebido - total;

  const finalizarVenda = () => {
    setModalPagamento(true);
  };

const confirmarVenda = () => {
  if (!cliente.trim() || !telefone.trim()) {
    alert('Preencha os campos de cliente e telefone.');
    return;
  }

  const valorFinal = revenda ? totalManual : total;
  const valorRestante = valorFinal - (pagamento.recebido || 0);
  const statusPagamento = pagamento.recebido >= valorFinal ? 'pago' : 'parcial';

  axios.post('http://localhost:5000/api/vendas', {
    caixa_id: caixaSelecionado.id,
    itens: carrinho,
    total: valorFinal,
    valor_recebido: pagamento.recebido,
    valor_restante: valorRestante > 0 ? valorRestante : 0,
    metodo_pagamento: pagamento.metodo,
    status_pagamento: statusPagamento,
    cliente,
    telefone,
    data_entrega: dataEntrega,
    observacao // ✅ incluído
  })
  .then(res => {
    console.log('Venda registrada com sucesso!');
    setModalPagamento(false);
    setCarrinho([]);
    setCliente('');
    setTelefone('');
    setDataEntrega('');
    setRevenda(false);
    setTotalManual(0);
    setObservacao('');
    setPagamento({ metodo: '', recebido: 0 });
    setVendaFinalizada(true); // 👈 para mostrar a tela de sucesso
  })
  .catch(err => {
    console.error('Erro ao registrar venda:', err.response?.data || err.message);
    alert('Erro ao registrar venda. Verifique os dados e tente novamente.');
  });
};





  if (vendaFinalizada) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Venda Concluída com Sucesso!</h2>
        <div className="flex gap-4 justify-center">
          <button onClick={() => window.location.reload()} className="bg-blue-500 text-white px-4 py-2 rounded">Nova Venda</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded">Imprimir Cupom</button>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded">Emitir Nota Fiscal</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Caixa: {caixaSelecionado?.nome}</h2>

      <div className="flex gap-6">
        <div className="w-2/3">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <div className="grid grid-cols-3 gap-2">
            {produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase())).map(produto => (
              <div key={produto.id} onClick={() => adicionarProduto(produto)} className="p-2 border rounded shadow hover:bg-purple-100 cursor-pointer">
                <p className="font-medium">{produto.nome}</p>
                <p className="text-sm">R$ {Number(produto.valor).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/3">
          <h3 className="text-lg font-bold mb-2">Carrinho</h3>
          {carrinho.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <div>
                <p>{item.nome}</p>
                <input
                  type="number"
                  value={item.quantidade}
                  onChange={(e) => alterarQuantidade(item.id, parseInt(e.target.value))}
                  className="w-16 border px-1"
                />
              </div>
              <div>
                <p>R$ {(item.valor * item.quantidade).toFixed(2)}</p>
                <button onClick={() => removerProduto(item.id)} className="text-red-500 text-sm">Remover</button>
              </div>
            </div>
          ))}
          <div className="mt-4 font-bold text-lg">Total: R$ {total.toFixed(2)}</div>
          <button
            onClick={finalizarVenda}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded"
            disabled={carrinho.length === 0}
          >Finalizar Venda</button>
        </div>
      </div>

    {modalPagamento && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-96">
      <h2 className="text-lg font-bold mb-4">Finalizar Pagamento</h2>

      <label className="block mb-2">
        Cliente:
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={cliente}
          onChange={e => setCliente(e.target.value)}
          placeholder="Cliente"
        />
      </label>

      <label className="block mb-2">
        Telefone:
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={telefone}
          onChange={e => setTelefone(e.target.value)}
          placeholder="Telefone"
        />
      </label>

      <label className="block mb-2">
        Data de Entrega:
        <input
          type="date"
          className="w-full border p-2 rounded"
          value={dataEntrega}
          onChange={e => setDataEntrega(e.target.value)}
        />
      </label>

      {/* Revenda Checkbox */}
      <label className="flex items-center mb-2">
        <input
          type="checkbox"
          className="mr-2"
          checked={revenda}
          onChange={e => setRevenda(e.target.checked)}
        />
        É para revenda?
      </label>

      {/* Valor manual se for revenda */}
      {revenda && (
        <label className="block mb-2">
          Valor Total Manual:
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={totalManual}
            onChange={e => setTotalManual(parseFloat(e.target.value) || 0)}
            placeholder="Digite o valor total"
          />
        </label>
      )}

      <label className="block mb-2">
        Forma de Pagamento:
        <select
          className="w-full border p-2 rounded"
          value={pagamento.metodo}
          onChange={e => setPagamento({ ...pagamento, metodo: e.target.value })}
        >
          <option value="">Selecione</option>
          <option value="dinheiro">Dinheiro</option>
          <option value="cartao">Cartão</option>
          <option value="pix">Pix</option>
        </select>
      </label>

      <label className="block mb-2">
        Valor Pago:
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={pagamento.recebido}
          onChange={e => setPagamento({ ...pagamento, recebido: parseFloat(e.target.value) || 0 })}
        />
      </label>

      {/* Observações */}
      <label className="block mb-4">
        Observações:
        <textarea
          className="w-full border p-2 rounded"
          value={observacao}
          onChange={e => setObservacao(e.target.value)}
          placeholder="Digite observações adicionais..."
        />
      </label>

      {/* Total e restante */}
      <div className="mb-2">
        Total: R$ {(revenda ? totalManual : total).toFixed(2)}
      </div>
      <div className="mb-4">
        Restante: R$ {((revenda ? totalManual : total) - (pagamento.recebido || 0)).toFixed(2)}
      </div>

      <div className="flex justify-between">
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded"
          onClick={() => setModalPagamento(false)}
        >
          Cancelar
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={confirmarVenda}
        >
          Confirmar Venda
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
