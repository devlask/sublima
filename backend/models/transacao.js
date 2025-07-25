// models/Transacao.js
module.exports = (sequelize, DataTypes) => {
  const Transacao = sequelize.define('Transacao', {
    descricao: DataTypes.STRING,
    tipo: DataTypes.ENUM('entrada', 'saida', 'socio'),
    valor: DataTypes.DECIMAL(10, 2),
    data: DataTypes.DATEONLY,
    entregue: DataTypes.BOOLEAN,
    observacao: DataTypes.STRING,
    caixa_id: DataTypes.INTEGER,
  });

  Transacao.associate = (models) => {
    Transacao.belongsTo(models.Caixa, { foreignKey: 'caixa_id' });
  };

  return Transacao;
};
