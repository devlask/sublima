// BACKEND - controller/transacaoController.js
const { Transacao, Caixa, Venda } = require('../models');
const { Op } = require('sequelize');


exports.listar = async (req, res) => {
  try {
    const { caixa_id, mes, ano } = req.query;
    const where = {};

    if (req.query.data_inicio && req.query.data_fim) {
  const inicio = new Date(`${req.query.data_inicio}T00:00:00`);

  inicio.setHours(0, 0, 0, 0); // Início do dia

  const fim = new Date(`${req.query.data_fim}T23:59:59`);
  fim.setHours(23, 59, 59, 999); // Final do dia

  where.data = { [Op.between]: [inicio, fim] };
}

    const transacoes = await Transacao.findAll({ where, order: [['data', 'DESC']] });
    
    // Cálculos para cards
    const totalEntrada = transacoes.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + parseFloat(t.valor), 0);
    const totalSaida = transacoes.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + parseFloat(t.valor), 0);
    const totalSocio = transacoes.filter(t => t.tipo === 'socio').reduce((acc, t) => acc + parseFloat(t.valor), 0);
    const saldo = totalEntrada - totalSaida - totalSocio;

    res.json({ transacoes, totalEntrada, totalSaida, totalSocio, saldo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const transacao = await Transacao.create(req.body);
    res.status(201).json(transacao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.editar = async (req, res) => {
  try {
    const { id } = req.params;
    await Transacao.update(req.body, { where: { id } });
    const atualizada = await Transacao.findByPk(id);
    res.json(atualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const { id } = req.params;
    await Transacao.destroy({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
