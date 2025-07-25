import { useState, useEffect } from "react";
import axios from "axios";

export default function ProdutoModal({ produto, onClose, onSave }) {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    valor: "",
    quantidade: "",
  });

  useEffect(() => {
    if (produto) setForm(produto);
  }, [produto]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (produto) {
        await axios.put(`/api/estoque/${produto.id}`, form);
      } else {
        await axios.post("/api/estoque", form);
      }

      onSave();
      onClose();
    } catch (err) {
      alert("Erro ao salvar produto.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {produto ? "Editar Produto" : "Novo Produto"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {["nome", "descricao", "categoria", "valor", "quantidade"].map((campo) => (
            <div key={campo}>
              <label className="block text-sm font-semibold capitalize">
                {campo}
              </label>
              <input
                type={campo === "valor" || campo === "quantidade" ? "number" : "text"}
                step={campo === "valor" ? "0.01" : undefined}
                required
                value={form[campo] || ""}
                onChange={(e) => setForm({ ...form, [campo]: e.target.value })}
                className="border px-3 py-1 rounded w-full"
              />
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="px-4 py-1 border rounded"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
