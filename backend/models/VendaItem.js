const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const VendaItem = sequelize.define('VendaItem', {
  venda_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
 produto_id: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'estoque', // ⚠️ nome da tabela no banco (não o modelo!)
    key: 'id'
  }
},
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valor_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes. FLOAT,
    allowNull: false
  }
}, {
  tableName: 'venda_itens',
  timestamps: false,
  underscored: true
});

const Estoque = require('./Estoque'); // 👈 importante importar

VendaItem.belongsTo(Estoque, {
  foreignKey: 'produto_id',
  as: 'produto'
});





module.exports = VendaItem;
