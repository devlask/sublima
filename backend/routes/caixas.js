const express = require('express');
const router = express.Router();
const caixaController = require('../controllers/caixaController');

router.post('/', caixaController.criarCaixa);
router.get('/', caixaController.listarCaixas);
router.put('/:id', caixaController.atualizarCaixa);
router.delete('/:id', caixaController.deletarCaixa);

module.exports = router;
