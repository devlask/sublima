
const express = require('express');
const router = express.Router();
const { Pedido, ItemPedido } = require('../models');

// POST /api/pedidos/:pedidoId/itens
router.post('/:pedidoId/itens', async (req, res) => {
  const { pedidoId } = req.params;
  const { produto, quantidade, valorUnitario, pagamento, valorSinal } = req.body;

  try {
    const pedido = await Pedido.findByPk(pedidoId);
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });

    const valorTotal = quantidade * valorUnitario;

    // Cria o item do pedido
    const novoItem = await ItemPedido.create({
      pedidoId,
      produto,
      quantidade,
      valorUnitario,
      valorTotal
    });

    // Atualiza valores no pedido
    pedido.valorTotal += valorTotal;
    pedido.valorSinal += pagamento === 'sinal' ? valorSinal : valorTotal;
    pedido.valorRestante = pedido.valorTotal - pedido.valorSinal;

    await pedido.save();

    res.status(201).json({ item: novoItem, pedidoAtualizado: pedido });
  } catch (err) {
    console.error('Erro ao adicionar item ao pedido:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});



// GET: listar todos os pedidos
// pedidos.js
router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      order: [['dataPedido', 'DESC']],
      include: [{ model: ItemPedido, as: 'itens' }]
    });
    res.json(pedidos);
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});
// POST: criar um novo pedido
router.post('/', async (req, res) => {
  try {
    const novo = await Pedido.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

module.exports = router;
