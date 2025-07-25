const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Venda = sequelize.define('Venda', {
  caixa_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  valor_recebido: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  valor_restante: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  metodo_pagamento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status_pedido: {
  type: DataTypes.STRING,
  defaultValue: "arte",
  },
  status_pagamento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data_entrega: {
  type: DataTypes.DATE,
  allowNull: true,
},
obs: {
  type: DataTypes.STRING,
  allowNull: true,
},
  created_at: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
},
  cliente: DataTypes.STRING,           // <-- Adicionado
    telefone: DataTypes.STRING 
}, 

{
  tableName: 'vendas',
  timestamps: true,
  underscored: true
});

module.exports = Venda;
