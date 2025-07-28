import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

// Importações das páginas principais
import Dashboard from "./pages/Dashboard";

// Vendas
import Pedidos from "./pages/Vendas/Pedidos";
import ProdutosSimples from "./pages/Vendas/ProdutosSimples";
import PDV from "./pages/pdv/SelecionarCaixa";
import PDVVendas from "./pages/pdv/venda";

// Financeiro
import Transacoes from "./pages/Financeiro/Transacoes";
import NotaFiscal from "./pages/Financeiro/NotaFiscal";
import Caixas from "./pages/Caixas";

// Estoque
import Compras from "./pages/Estoque/Compras";
import EstoquePage from "./pages/Estoque/Estoque";

// Comunicação Visual
import Insumos from "./pages/Cvisual/Insumos";
import Maquinas from "./pages/Cvisual/Maquinas";
import Processos from "./pages/Cvisual/Processos";
import Materiais from "./pages/Cvisual/Materiais";
import Papeis from "./pages/Cvisual/Papeis";
import ProdutosCV from "./pages/Cvisual/Produtos";

// Cadastros
import StatusVenda from "./pages/Cadastros/StatusVenda";
import EstagiosVenda from "./pages/Cadastros/EstagiosVenda";
import StatusProducao from "./pages/Cadastros/StatusProducao";
import Pessoas from "./pages/Cadastros/Pessoas";
import CondPagamento from "./pages/Cadastros/CondPagamento";

// Relatórios
import RelFinanceiro from "./pages/Relatorio/RelFinanceiro";
import RelVendas from "./pages/Relatorio/RelVendas";
import RelComissoes from "./pages/Relatorio/RelComissoes";
import RelEstoque from "./pages/Relatorio/RelEstoque";
import LogsAcesso from "./pages/Relatorio/LogsAcesso";

// ...
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rota protegida */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="min-h-screen w-full bg-gray-100 text-gray-900 flex">
                <Sidebar />
                <div className="flex-1 flex flex-col min-h-screen">
                  <Topbar />
                  <main className="flex-1 p-4 bg-white overflow-auto">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/Vendas/pedidos" element={<Pedidos />} />
                      <Route path="/Vendas/produtos-simples" element={<ProdutosSimples />} />
                      <Route path="/pdv/SelecionarCaixa" element={<PDV />} />
                      <Route path="/pdv/venda" element={<PDVVendas />} />
                      <Route path="/Financeiro/transacoes" element={<Transacoes />} />
                      <Route path="/Financeiro/nota-fiscal" element={<NotaFiscal />} />
                      <Route path="/Financeiro/caixas" element={<Caixas />} />
                      <Route path="/Estoque/compras" element={<Compras />} />
                      <Route path="/Estoque/estoque" element={<EstoquePage />} />
                      <Route path="/Cvisual/insumos" element={<Insumos />} />
                      <Route path="/Cvisual/maquinas" element={<Maquinas />} />
                      <Route path="/Cvisual/processos" element={<Processos />} />
                      <Route path="/Cvisual/materiais" element={<Materiais />} />
                      <Route path="/Cvisual/papeis" element={<Papeis />} />
                      <Route path="/Cvisual/produtos" element={<ProdutosCV />} />
                      <Route path="/Cadastros/status-venda" element={<StatusVenda />} />
                      <Route path="/Cadastros/estagios-venda" element={<EstagiosVenda />} />
                      <Route path="/Cadastros/status-producao" element={<StatusProducao />} />
                      <Route path="/Cadastros/pessoas" element={<Pessoas />} />
                      <Route path="/Cadastros/cond-pagamento" element={<CondPagamento />} />
                      <Route path="/relatorio/relatorio-financeiro" element={<RelFinanceiro />} />
                      <Route path="/relatorio/relatorio-vendas" element={<RelVendas />} />
                      <Route path="/relatorio/relatorio-comissoes" element={<RelComissoes />} />
                      <Route path="/relatorio/relatorio-estoque" element={<RelEstoque />} />
                      <Route path="/relatorio/logs-acesso" element={<LogsAcesso />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

