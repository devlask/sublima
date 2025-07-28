import React, { useState } from "react";
import axios from "axios";

export default function Pessoas() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("vendedor");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !email || !senha) {
      return setMensagem("Preencha todos os campos.");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/registrar", {
        nome,
        email,
        senha,
        tipo,
      });

      setMensagem("Usuário cadastrado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
      setTipo("vendedor");
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded">
      <h1 className="text-xl font-bold mb-4">Cadastrar Novo Usuário</h1>

      {mensagem && <p className="mb-4 text-sm text-red-600">{mensagem}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="vendedor">Vendedor</option>
          <option value="admin">Administrador</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
