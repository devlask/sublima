// models/ItemPedido.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ItemPedido = sequelize.define('ItemPedido', {
  pedidoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pedidos',
      key: 'id'
    }
  },
  produto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valorUnitario: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  valorTotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'itenspedidos',
  timestamps: false
});

module.exports = ItemPedido;
