const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,     // Nome do banco
  process.env.DB_USER,     // Usuário (ex: root)
  process.env.DB_PASS,     // Senha
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão MySQL bem-sucedida!');
  } catch (err) {
    console.error('Erro na conexão com o banco:', err);
  }
};

module.exports = { sequelize, connectDB };
