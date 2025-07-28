const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');


const Pedido = require('./Pedido');
const ItemPedido = require('./ItemPedido');
const Venda = require('./venda');
const VendaItem = require('./vendaItem');
const Estoque = require('./Estoque'); // ✅ Importado
const Transacao = require('./transacao')(sequelize, Sequelize.DataTypes);
const Caixa = require('./Caixa')
const Usuario = require('./usuario')(sequelize, Sequelize.DataTypes);

// Relacionamentos - Pedido
Pedido.hasMany(ItemPedido, { foreignKey: 'pedidoId', as: 'itens' });
ItemPedido.belongsTo(Pedido, { foreignKey: 'pedidoId', as: 'pedido' });

// Relacionamentos - Venda
Venda.hasMany(VendaItem, { as: 'itens', foreignKey: 'venda_id' });
VendaItem.belongsTo(Venda, { foreignKey: 'venda_id' });


// Relacionamentos entre transações e outros modelos
if (Transacao.associate) Transacao.associate({ Caixa, Venda });
if (Caixa.associate) Caixa.associate({ Transacao, Venda });
if (Venda.associate) Venda.associate({ Transacao, Caixa });


// ✅ Alias único para evitar conflito
VendaItem.belongsTo(Estoque, {
  foreignKey: 'produto_id',
  as: 'produtoEstoque' // <--- trocado de 'produto' para 'produtoEstoque'
});

// Exportação de todos os modelos
module.exports = {
  
  Pedido,
  Transacao,
  Usuario,
  Caixa,
  ItemPedido,
  Venda,
  VendaItem,
  Estoque // ✅ Incluído no export
};


