import {
    FaHome,
    FaCashRegister,
    FaBoxes,
    FaPrint,
    FaList,
    FaFileAlt,
    FaChartBar,
  } from "react-icons/fa";
  
  export const sidebarData = [
    {
      title: "Dashboard",
      icon: FaHome,
      path: "/dashboard", // ou "/" se for a rota raiz
    },
    {
      title: "Vendas",
      icon: FaCashRegister,
      submenu: [
        { title: "Pedidos", path: "Vendas/pedidos" },
        { title: "Produtos Simples", path: "Vendas/produtos-simples" },
        { title: "PDV", path: "pdv/SelecionarCaixa" },

      ],
    },
    {
      title: "Financeiro",
      icon: FaFileAlt,
      submenu: [
        { title: "Transações", path: "Financeiro/transacoes" },
        { title: "Nota Fiscal", path: "Financeiro/nota-fiscal" },
        { title: "Caixas PDV", path: "Financeiro/caixas" },
      ],
    },
    {
      title: "Produtos",
      icon: FaPrint,
      submenu: [
         { title: "Produtos", path: "Cvisual/produtos" },
      ],
    },
    {
      title: "Relatórios",
      icon: FaChartBar,
      submenu: [
        { title: "Financeiro", path: "relatorio/relatorio-financeiro" },
        { title: "Vendas", path: "relatorio/relatorio-vendas" },
        { title: "Estoque", path: "relatorio/relatorio-estoque" },
        { title: "Logs de Acesso", path: "relatorio/logs-acesso" },
      ],
    },
  ];
  