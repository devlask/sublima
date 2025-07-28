import {
    FaHome,
    FaCashRegister,
    FaBoxes,
    FaPrint,
    FaList,
    FaFileAlt,
    FaChartBar,
    FaUser,
  } from "react-icons/fa";
  
  export const sidebarData = [
    {
      title: "Dashboard",
      icon: FaHome,
      roles: ["admin", "vendedor"],
      path: "/dashboard", // ou "/" se for a rota raiz
    },
    {
      title: "Vendas",
      icon: FaCashRegister,
      roles: ["admin", "vendedor"],
      submenu: [
        { title: "Pedidos", roles: ["admin", "vendedor"], path: "/Vendas/pedidos" },
        { title: "Produtos Simples", roles: ["admin", "vendedor"], path: "/Vendas/produtos-simples" },
        { title: "PDV", roles: ["admin", "vendedor"], path: "/pdv/SelecionarCaixa" },

      ],
    },
    {
      title: "Financeiro",
      roles: ["admin", "vendedor"],
      icon: FaFileAlt,
      submenu: [
        { title: "Transações", roles: ["admin", "vendedor"], path: "/Financeiro/transacoes" },
        { title: "Nota Fiscal", roles: ["admin", "vendedor"], path: "/Financeiro/nota-fiscal" },
        { title: "Caixas PDV", roles: ["admin", "vendedor"], path: "/Financeiro/caixas" },
      ],
    },
    {
      title: "Produtos",
      roles: ["admin", "vendedor"],
      icon: FaPrint,
      submenu: [
         { title: "Produtos", roles: ["admin", "vendedor"], path: "/Cvisual/produtos" },
      ],
    },
    {
      title: "Relatórios",
      roles: ["admin", "vendedor"],
      icon: FaChartBar,
      submenu: [
        { title: "Financeiro", roles: ["admin"], path: "/relatorio/relatorio-financeiro" },
        { title: "Vendas", roles: ["admin"], path: "/relatorio/relatorio-vendas" },
        { title: "Estoque", roles: ["admin"], path: "/relatorio/relatorio-estoque" },
        { title: "Logs de Acesso", roles: ["admin"], path: "/relatorio/logs-acesso" },
      ],
    },
    {
      title: "Usuarios",
      icon: FaUser,
      roles: ["admin"],
      path: "/Cadastros/Pessoas",
    },
  ];
  