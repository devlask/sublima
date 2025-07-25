// models/Pedido.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Pedido = sequelize.define('Pedido', {
  cliente: { type: DataTypes.STRING, allowNull: false },
  valorTotal: { type: DataTypes.FLOAT, defaultValue: 0 },
  valorSinal: { type: DataTypes.FLOAT, defaultValue: 0 },
  valorRestante: { type: DataTypes.FLOAT, defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'A Receber' },
  statusPedido: { type: DataTypes.STRING, defaultValue: 'aguardando' },
  statusPagamento: { type: DataTypes.STRING, defaultValue: 'pendente' },
  dataPedido: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  dataFechamento: { type: DataTypes.DATEONLY },
  dataEntrega: { type: DataTypes.DATEONLY },
  vencimento: { type: DataTypes.DATE }
}, {
  tableName: 'pedidos',
  timestamps: false
});

module.exports = Pedido;
