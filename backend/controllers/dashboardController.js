const { Venda, VendaItem, Estoque } = require('../models');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');
const Sequelize = require('sequelize'); // ✅ Adicione isso

// Entregas nos próximos 3 dias
exports.getEntregasProximas = async (req, res) => {
  try {
    const hoje = new Date();
    const daqui3dias = new Date();
    daqui3dias.setDate(hoje.getDate() + 3);

    const entregas = await Venda.findAll({
      where: {
        data_entrega: {
          [Op.between]: [hoje, daqui3dias]
        }
      },
      order: [['data_entrega', 'ASC']]
    });

    res.json(entregas);
  } catch (error) {
    console.error("Erro em getEntregasProximas:", error.message);
    res.status(500).json({ error: 'Erro ao buscar entregas próximas' });
  }
};


// Pedidos atrasados (não entregues e com data menor que hoje)
exports.getPedidosAtrasados = async (req, res) => {
  try {
    const hoje = new Date();

    const atrasados = await Venda.findAll({
      where: {
        data_entrega: {
          [Op.lt]: hoje
        },
        status_pedido: {
          [Op.not]: 'entregue'
        }
      },
      order: [['data_entrega', 'ASC']]
    });

    res.json(atrasados);
  } catch (error) {
    console.error("Erro em getPedidosAtrasados:", error.message);
    res.status(500).json({ error: 'Erro ao buscar pedidos atrasados' });
  }
};


/// Ranking dos produtos mais vendidos
exports.getRankingProdutos = async (req, res) => {
  try {
    const ranking = await VendaItem.findAll({
      attributes: [
        'produto_id',
        [Sequelize.fn('SUM', Sequelize.col('VendaItem.quantidade')), 'total_vendido'] // 👈 corrigido aqui
      ],
      include: [
        {
          model: Estoque,
          as: 'produto',
          attributes: ['nome']
        }
      ],
      group: ['produto_id', 'produto.id'],
      order: [[Sequelize.fn('SUM', Sequelize.col('VendaItem.quantidade')), 'DESC']], // 👈 também corrigido aqui
      limit: 10
    });

    res.json(ranking);
  } catch (error) {
    console.error("Erro ao buscar ranking de produtos:", error);
    res.status(500).json({ error: 'Erro ao buscar ranking de produtos' });
  }
};
