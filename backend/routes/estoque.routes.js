const express = require('express');
const router = express.Router();
const Estoque = require('../models/Estoque'); // Certifique-se do caminho estar certo

router.get('/', async (req, res) => {
  try {
    const itens = await Estoque.findAll();
    res.json(itens);
  } catch (err) {
    console.error('Erro ao buscar estoque:', err);
    res.status(500).json({ message: 'Erro ao buscar estoque' });
  }
});

module.exports = router;