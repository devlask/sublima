const Caixa = require('../models/Caixa');

// Criar novo caixa
exports.criarCaixa = async (req, res) => {
  console.log('REQ BODY:', req.body); // 👈 Adicione isso
  try {
    const novoCaixa = await Caixa.create(req.body);
    res.status(201).json(novoCaixa);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar caixa', detalhes: error.message });
  }
};



// Listar todos
exports.listarCaixas = async (req, res) => {
  try {
    const caixas = await Caixa.findAll();
    res.status(200).json(caixas);
  } catch (error) { 
    res.status(500).json({ erro: 'Erro ao buscar caixas' });
  }
};

// Atualizar caixa
exports.atualizarCaixa = async (req, res) => {
  try {
    await Caixa.update(req.body, { where: { id: req.params.id } });
    res.status(200).json({ mensagem: 'Caixa atualizado' });
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao atualizar caixa' });
  }
};

// Deletar caixa
exports.deletarCaixa = async (req, res) => {
  try {
    await Caixa.destroy({ where: { id: req.params.id } });
    res.status(200).json({ mensagem: 'Caixa deletado' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar caixa' });
  }
};
