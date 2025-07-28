import React, { useState } from "react";
import { sidebarData } from "./SidebarData";
import { FaBars } from "react-icons/fa";
import SidebarMenu from "./SidebarMenu";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  // Obtem o tipo de usuário logado
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
  const tipoUsuario = usuarioLogado?.tipo;

  const toggleMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  // Filtra menus com base no tipo do usuário
  const menusFiltrados = sidebarData.filter((item) => {
    return item.roles?.includes(tipoUsuario);
  });

  return (
    <div className="flex h-screen">
      {/* Menu lateral roxo */}
      <div className="bg-purple-700 w-16 flex flex-col items-center py-4">
        <FaBars className="text-white mb-6" />

        {menusFiltrados.map((item, index) => {
          const Icon = item.icon;

          return (
            <div key={index} className="group relative my-4">
              <button
                onClick={() => {
                  if (item.submenu) {
                    toggleMenu(index);
                  } else if (item.path) {
                    navigate(item.path, { replace: true });
                    setActiveMenu(null);
                  }
                }}
                className="text-white hover:text-white bg-transparent focus:outline-none"
              >
                <Icon size={20} />
              </button>
              <span className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-10">
                {item.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Submenu cinza ao lado */}
      {activeMenu !== null && menusFiltrados[activeMenu]?.submenu && (
        <div className="bg-gray-100 w-64 p-4">
          <SidebarMenu
            title={menusFiltrados[activeMenu].title}
            submenu={
              menusFiltrados[activeMenu].submenu.filter((sub) =>
                sub.roles?.includes(tipoUsuario)
              )
            }
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
