const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const bcrypt = require('bcrypt');
const { Usuario } = require('../models'); // IMPORTAÇÃO CORRETA DO MODELO

router.post('/login', AuthController.login);

// routes/auth.js
router.post('/registrar', async (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await Usuario.create({ nome, email, senha: senhaHash, tipo });
    res.status(201).json({ message: 'Usuário criado com sucesso', usuario: novoUsuario });
  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});


module.exports = router;
