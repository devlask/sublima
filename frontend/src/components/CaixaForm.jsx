import { useState, useEffect } from 'react';

export default function CaixaForm({ onSave, onCancel, initialData }) {
  const [nome, setNome] = useState('');
  const [saldo, setSaldo] = useState('');
  const [data, setData] = useState('');

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome);
      setSaldo(initialData.saldo_inicial);
      setData(initialData.data_saldo_inicial);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    onSave({
        nome,
        saldo_inicial: parseFloat(saldo),
        data_saldo_inicial: data
      });
  };
  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-4">
      <div className="mb-2">
        <label className="block text-sm font-medium">Nome do Caixa</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-2 border rounded" />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Saldo Inicial</label>
        <input value={saldo} onChange={(e) => setSaldo(e.target.value)} className="w-full p-2 border rounded" />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Data do Saldo</label>
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="w-full p-2 border rounded" />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Salvar</button>
        <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
      </div>
    </form>
  );
}
