import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { format } from 'date-fns';

export default function Financeiro() {
  const [transacoes, setTransacoes] = useState([]);
  const [resumo, setResumo] = useState({});
  const [caixaSelecionado, setCaixaSelecionado] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [caixas, setCaixas] = useState([]);

  // ESTADO NOVO - modal visível
  const [modalAberto, setModalAberto] = useState(false);

  // ESTADO NOVO - dados do formulário
  const [novaTx, setNovaTx] = useState({
    data: format(new Date(), 'yyyy-MM-dd'),
    tipo: 'saida',
    descricao: '',
    valor: '',
    entregue: false, // NOVO: status entrega
  });

  useEffect(() => {
    buscarCaixas();
  }, []);

  useEffect(() => {
    buscarTransacoes();
  });

  const buscarCaixas = async () => {
    const res = await axios.get('http://localhost:5000/api/caixas');
    setCaixas(res.data);
    setCaixaSelecionado(res.data[0]?.id || '');
  };

 const buscarTransacoes = async () => {
  if (!caixaSelecionado) return;

  try {
    let url = `http://localhost:5000/api/transacoes?caixa_id=${caixaSelecionado}`;

    if (dataInicio && dataFim) {
      url += `&data_inicio=${dataInicio}&data_fim=${dataFim}`;
    }

    const res = await axios.get(url);

    setTransacoes(res.data.transacoes);
    setResumo({
      entradas: res.data.totalEntrada,
      saidas: res.data.totalSaida,
      socio: res.data.totalSocio,
      saldo: res.data.saldo,
    });
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
  }
};


  // Função para salvar nova transação
  const salvarTransacao = async () => {
    try {
      if (!novaTx.descricao || !novaTx.valor || !novaTx.data) {
        alert('Preencha todos os campos.');
        return;
      }
      await axios.post('http://localhost:5000/api/transacoes', {
        caixa_id: caixaSelecionado,
        data: novaTx.data,
        tipo: novaTx.tipo,
        descricao: novaTx.descricao,
        valor: parseFloat(novaTx.valor),
        entregue: novaTx.entregue,
      });
      setModalAberto(false);
      setNovaTx({
        data: format(new Date(), 'yyyy-MM-dd'),
        tipo: 'saida',
        descricao: '',
        valor: '',
        entregue: false,
      });
      buscarTransacoes();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      alert('Erro ao salvar transação.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-end">
        

        <Input
  type="date"
  value={dataInicio}
  onChange={e => setDataInicio(e.target.value)}
  className="w-40"
/>

<Input
  type="date"
  value={dataFim}
  onChange={e => setDataFim(e.target.value)}
  className="w-40"
/>

        <Button onClick={buscarTransacoes}>Buscar</Button>

        {/* BOTÃO NOVO */}
        <Button onClick={() => setModalAberto(true)} className="ml-auto bg-blue-600 hover:bg-blue-700">
          Nova Transação
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-100">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Entradas</p>
            <p className="text-xl font-bold text-green-800">
              R$ {Number(resumo.entradas || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-100">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Saídas</p>
            <p className="text-xl font-bold text-red-800">
              R$ {Number(resumo.saidas || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-100">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Sócio</p>
            <p className="text-xl font-bold text-yellow-800">
              R$ {Number(resumo.socio || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-blue-100">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Saldo</p>
            <p className="text-xl font-bold text-blue-800">
              R$ {Number(resumo.saldo || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transações */}
      <div className="bg-white rounded-lg shadow overflow-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 text-sm text-left">
            <tr>
              <th className="p-2">Data</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Descrição</th>
              <th className="p-2 text-right">Valor</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-center">Entregue</th> 
            </tr>
          </thead>
          <tbody>
            {transacoes.map(tx => (
              <tr key={tx.id} className="border-t text-sm hover:bg-gray-50">
                <td className="p-2">
  {format(new Date(tx.data + 'T00:00:00'), 'dd/MM/yyyy')}
</td>
                <td className="p-2 capitalize">{tx.tipo}</td>
                <td className="p-2">{tx.descricao}</td>
                <td className="p-2 text-right">R$ {Number(tx.valor).toFixed(2)}</td>
                <td className="p-2 text-center">
                  {tx.tipo === 'saida' ? (
                    <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded">Despesa</span>
                  ) : tx.tipo === 'socio' ? (
                    <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">Sócio</span>
                  ) : (
                    <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded">Entrada</span>
                  )}
                </td>
                {/* Coluna nova: Entregue */}
                <td className="p-2 text-center">
                  {tx.entregue ? (
                    <span className="text-green-600 font-semibold">Sim</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Não</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL NOVO */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nova Transação</h2>

            <label className="block mb-2">
              Data:
              <Input
                type="date"
                value={novaTx.data}
                onChange={e => setNovaTx(prev => ({ ...prev, data: e.target.value }))}
              />
            </label>

            <label className="block mb-2">
              Tipo:
              <Select
                value={novaTx.tipo}
                onValueChange={valor => setNovaTx(prev => ({ ...prev, tipo: valor }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                  <SelectItem value="socio">Sócio</SelectItem>
                </SelectContent>
              </Select>
            </label>

            <label className="block mb-2">
              Descrição:
              <Input
                type="text"
                value={novaTx.descricao}
                onChange={e => setNovaTx(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descrição da transação"
              />
            </label>

            <label className="block mb-2">
              Valor:
              <Input
                type="number"
                min="0"
                step="0.01"
                value={novaTx.valor}
                onChange={e => setNovaTx(prev => ({ ...prev, valor: e.target.value }))}
                placeholder="0.00"
              />
            </label>

            <label className="flex items-center mb-4 space-x-2">
              <input
                type="checkbox"
                checked={novaTx.entregue}
                onChange={e => setNovaTx(prev => ({ ...prev, entregue: e.target.checked }))}
              />
              <span>Entregue</span>
            </label>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setModalAberto(false)}>
                Cancelar
              </Button>
              <Button onClick={salvarTransacao}>Salvar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
