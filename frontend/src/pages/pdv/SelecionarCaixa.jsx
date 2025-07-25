// pages/pdv/SelecionarCaixa.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SelecionarCaixa() {
  const [caixas, setCaixas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/caixas")
      .then(res => {
        setCaixas(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar caixas:", err);
        setLoading(false);
      });
  }, []);

  const selecionarCaixa = (caixa) => {
    localStorage.setItem("caixaSelecionado", JSON.stringify(caixa));
    navigate("/pdv/venda");
  };

  if (loading) return <div className="p-4">Carregando caixas...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Selecione o Caixa</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {caixas.map(caixa => (
          <div key={caixa.id} className="bg-white rounded-xl shadow p-4 cursor-pointer hover:bg-gray-100" onClick={() => selecionarCaixa(caixa)}>
            <h3 className="text-lg font-semibold">{caixa.nome}</h3>
            <p>Data: {new Date(caixa.data).toLocaleDateString()}</p>
            <p>Valor Inicial: R$ {parseFloat(caixa.valor_inicial).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
