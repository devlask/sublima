import React from "react";
import { useNavigate } from "react-router-dom";

const SidebarMenu = ({ title, submenu }) => {
  const navigate = useNavigate();

  if (!Array.isArray(submenu)) {
    return null; // ou pode renderizar uma mensagem alternativa, se quiser
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ul>
        {submenu.map((subItem, index) => (
          <li key={index} className="mb-2">
            <button
              onClick={() => navigate(subItem.path)}
              className="text-gray-800 hover:text-purple-700"
            >
              {subItem.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarMenu;
