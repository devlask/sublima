const express = require('express');
const router = express.Router();
const vendaController = require('../controllers/vendaController');

router.post('/', vendaController.criarVenda);
router.get('/', vendaController.listarVendas);
router.delete('/:id', vendaController.excluirVenda);
router.put('/:id/status', vendaController.atualizarStatusPedido);
router.get('/:id/recibo', vendaController.gerarRecibo); 

module.exports = router;
    