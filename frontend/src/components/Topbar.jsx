// src/components/Topbar.jsx
const Topbar = () => {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b">
      <h2 className="text-xl font-semibold text-[#5a189a]">Bem-vindo ao painel Sublima</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">admin@sublima.com</span>
        <img
          src="https://ui-avatars.com/api/?name=Admin&background=7b2cbf&color=fff"
          alt="Avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
};

export default Topbar;
