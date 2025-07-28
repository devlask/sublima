import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    // Pega usuário do localStorage (ou contexto, se tiver)
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fecha menu se clicar fora
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b relative">
      <h2 className="text-xl font-semibold text-[#5a189a]">Bem-vindo ao painel Sublima</h2>
      
      <div className="flex items-center gap-4 relative" ref={menuRef}>
        <span className="text-sm text-gray-600 cursor-default">
          {user ? user.nome : "Carregando..."}
        </span>
        <img
          src={`https://ui-avatars.com/api/?name=${user ? encodeURIComponent(user.nome) : "User"}&background=7b2cbf&color=fff`}
          alt="Avatar"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={() => setOpenMenu(!openMenu)}
        />
        
        {openMenu && (
          <div className="absolute right-0 mt-10 bg-white border rounded shadow-md w-36 z-20">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-purple-100"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
