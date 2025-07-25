const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Estoque = sequelize.define('Estoque', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valor: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'estoque',
  timestamps: false
});



exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await Estoque.findAll(); // retorna array
    res.json(produtos);
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    res.status(500).json({ erro: 'Erro ao buscar produtos' });
  }
};

module.exports = Estoque;
