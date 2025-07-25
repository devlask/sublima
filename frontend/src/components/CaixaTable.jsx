export default function CaixaTable({ caixas, onEdit, onDelete }) {
    return (
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Nome</th>
            <th className="p-2">Saldo Inicial</th>
            <th className="p-2">Data</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {caixas.map(caixa => (
            <tr key={caixa.id} className="border-b">
              <td className="p-2">{caixa.id}</td>
              <td className="p-2">{caixa.nome}</td>
              <td className="p-2">R$ {parseFloat(caixa.saldo_inicial).toFixed(2)}</td>
              <td className="p-2">{caixa.data_saldo}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => onEdit(caixa)} className="text-blue-600">Editar</button>
                <button onClick={() => onDelete(caixa.id)} className="text-red-600">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  