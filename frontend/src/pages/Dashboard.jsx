import { useState, useEffect } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaTruck,
  FaBoxOpen,
  FaClipboardCheck,
  FaTools,
  FaPaintBrush,
  FaFolder,
  FaTimes,
  FaHandshake,
  FaPlus,
} from "react-icons/fa";

const dataPedidos = [
  { name: "Jun", offset: 0, visual: 0 },
  { name: "Jul", offset: 0, visual: 0 },
  { name: "Ago", offset: 1, visual: 2 },
  { name: "Set", offset: 2, visual: 3 },
  { name: "Out", offset: 0, visual: 0 },
  { name: "Nov", offset: 0, visual: 0 },
  { name: "Dez", offset: 0, visual: 0 },
  { name: "Jan", offset: 0, visual: 0 },
  { name: "Fev", offset: 0, visual: 0 },
  { name: "Mar", offset: 0, visual: 0 },
  { name: "Abr", offset: 0, visual: 0 },
  { name: "Mai", offset: 0, visual: 1 },
];

const COLORS = ["#28a745", "#e0e0e0"];

export default function Dashboard() {
  const [margem, setMargem] = useState(0);
  const meta = 50000;

  const [entregasProximas, setEntregasProximas] = useState([]);
  const [pedidosAtrasados, setPedidosAtrasados] = useState([]);
  const [rankingProdutos, setRankingProdutos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/dashboard/entregas-proximas")
      .then((res) => setEntregasProximas(res.data))
      .catch(() => setEntregasProximas([]));

    axios.get("http://localhost:5000/api/dashboard/pedidos-atrasados")
      .then((res) => setPedidosAtrasados(res.data))
      .catch(() => setPedidosAtrasados([]));

    axios.get("http://localhost:5000/api/dashboard/ranking-produtos")
      .then((res) => setRankingProdutos(res.data))
      .catch(() => setRankingProdutos([]));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <a
          href="/pdv/venda"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus /> Nova Venda
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow col-span-1 flex flex-col items-center">
          <h2 className="text-sm mb-2">Margem Contribuição (mês)</h2>
          <PieChart width={160} height={160}>
            <Pie
              data={[{ value: margem }, { value: meta - margem }]}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
          </PieChart>
          <p className="text-2xl font-bold">R$ {margem.toFixed(2)}</p>
          <p className="text-gray-500 text-sm">Meta: R$ {meta.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded shadow col-span-2">
          <h2 className="text-sm mb-2">Pedidos</h2>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={dataPedidos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="offset" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="visual" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <StatusCard icon={<FaFolder />} label="Aguardando" count={1} color="bg-indigo-600" />
        <StatusCard icon={<FaPaintBrush />} label="Arte" count={1} color="bg-orange-400" />
        <StatusCard icon={<FaTools />} label="Produção" count={1} color="bg-blue-500" />
        <StatusCard icon={<FaClipboardCheck />} label="Finalizado" count={0} color="bg-green-700" />
        <StatusCard icon={<FaBoxOpen />} label="Expedição" count={0} color="bg-blue-700" />
        <StatusCard icon={<FaTruck />} label="Entregue" count={1} color="bg-teal-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm font-bold mb-2">📦 Entregas Próximas</h2>
          <ul className="text-sm space-y-1">
            {entregasProximas.map((entrega) => (
              <li key={entrega.id}>
                {entrega.cliente} - até <strong>{entrega.data_entrega}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm font-bold mb-2 text-red-600">⚠️ Pedidos Atrasados</h2>
          <ul className="text-sm space-y-1">
            {pedidosAtrasados.map((pedido) => (
              <li key={pedido.id}>
                {pedido.cliente} - previsto para <strong>{pedido.data_entrega}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-sm font-bold mb-4">🏆 Produtos Mais Vendidos</h2>
        <ol className="list-decimal pl-5 text-sm space-y-1">
          {rankingProdutos.map((prod, index) => (
            <li key={index}>
              {prod.produto?.nome} - <strong>{prod.total_vendido}</strong> vendidos
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function StatusCard({ icon, label, count, color }) {
  return (
    <div className={`flex items-center gap-2 p-4 rounded shadow text-white ${color}`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <div className="text-xl font-bold">{count}</div>
        <div className="text-sm uppercase">{label}</div>
      </div>
    </div>
  );
}
