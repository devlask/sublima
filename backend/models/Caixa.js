const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');

const Caixa = sequelize.define('Caixa', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  saldo_inicial: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  data_saldo_inicial: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  conta_vinculada: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'caixas',
  timestamps: true,
  underscored: true
});

module.exports = Caixa;
