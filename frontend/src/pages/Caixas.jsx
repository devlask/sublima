import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CaixaForm from '../components/CaixaForm';
import CaixaTable from '../components/CaixaTable';

export default function Caixas() {
  const [caixas, setCaixas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editCaixa, setEditCaixa] = useState(null);

  const fetchCaixas = async () => {
    const res = await api.get('/caixas');
    setCaixas(res.data);
  };

  useEffect(() => {
    fetchCaixas();
  }, []);

  const handleSave = async (caixa) => {
    if (editCaixa) {
      await api.put(`/caixas/${editCaixa.id}`, caixa);
    } else {
      await api.post('/caixas', caixa);
    }
    fetchCaixas();
    setShowForm(false);
    setEditCaixa(null);
  };

  const handleEdit = (caixa) => {
    setEditCaixa(caixa);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await api.delete(`/caixas/${id}`);
    fetchCaixas();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Caixas PDV</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          Novo Caixa
        </button>
      </div>

      {showForm && (
        <CaixaForm onSave={handleSave} onCancel={() => { setShowForm(false); setEditCaixa(null); }} initialData={editCaixa} />
      )}

      <CaixaTable caixas={caixas} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
