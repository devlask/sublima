// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/entregas-proximas', dashboardController.getEntregasProximas);
router.get('/pedidos-atrasados', dashboardController.getPedidosAtrasados);
router.get('/ranking-produtos', dashboardController.getRankingProdutos);

module.exports = router;
