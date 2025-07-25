import { useEffect, useState } from "react";
import axios from "axios";
import ProdutoModal from "./ProdutoModal";
import { ArrowUp, ArrowDown } from "lucide-react"; // ícones bonitos de seta

export default function ProdutoLista() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [colunaOrdenada, setColunaOrdenada] = useState("id");
  const [ordemAscendente, setOrdemAscendente] = useState(true);

  const buscarProdutos = async () => {
    const res = await axios.get("http://localhost:5000/api/estoque");
    setProdutos(res.data);
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  const ordenarPor = (coluna) => {
    if (coluna === colunaOrdenada) {
      setOrdemAscendente(!ordemAscendente);
    } else {
      setColunaOrdenada(coluna);
      setOrdemAscendente(true);
    }
  };

  const produtosFiltrados = produtos
    .filter((p) =>
      p.nome?.toLowerCase().includes(busca.toLowerCase())
    )
    .sort((a, b) => {
      const valorA = a[colunaOrdenada];
      const valorB = b[colunaOrdenada];

      if (typeof valorA === "string") {
        return ordemAscendente
          ? valorA.localeCompare(valorB)
          : valorB.localeCompare(valorA);
      } else {
        return ordemAscendente ? valorA - valorB : valorB - valorA;
      }
    });

  const IconeOrdenacao = ({ coluna }) => {
    if (coluna !== colunaOrdenada) return null;
    return ordemAscendente ? (
      <ArrowUp size={14} className="inline ml-1" />
    ) : (
      <ArrowDown size={14} className="inline ml-1" />
    );
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between mb-4 items-center">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border px-3 py-1 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          onClick={() => {
            setProdutoSelecionado(null);
            setModalAberto(true);
          }}
        >
          + Adicionar Produto
        </button>
      </div>

      <table className="w-full border text-sm shadow-sm rounded overflow-hidden">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            {[
              ["id", "ID"],
              ["nome", "Nome"],
              ["descricao", "Descrição"],
              ["categoria", "Categoria"],
              ["valor", "Valor"],
              ["quantidade", "Estoque"],
            ].map(([campo, label]) => (
              <th
                key={campo}
                onClick={() => ordenarPor(campo)}
                className="border px-3 py-2 cursor-pointer hover:bg-gray-200 transition"
              >
                {label}
                <IconeOrdenacao coluna={campo} />
              </th>
            ))}
            <th className="border px-3 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosFiltrados.map((prod) => (
            <tr
              key={prod.id}
              className="hover:bg-blue-50 transition border-b"
            >
              <td className="px-3 py-2">{prod.id}</td>
              <td className="px-3 py-2">{prod.nome}</td>
              <td className="px-3 py-2">{prod.descricao}</td>
              <td className="px-3 py-2">{prod.categoria}</td>
              <td className="border px-2 py-1">R$ {Number(prod.valor).toFixed(2)}</td>
              <td className="px-3 py-2">{prod.quantidade}</td>
              <td className="px-3 py-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => {
                    setProdutoSelecionado(prod);
                    setModalAberto(true);
                  }}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalAberto && (
        <ProdutoModal
          produto={produtoSelecionado}
          onClose={() => setModalAberto(false)}
          onSave={buscarProdutos}
        />
      )}
    </div>
  );
}
