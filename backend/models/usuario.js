module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define("Usuario", {
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    senha: DataTypes.STRING,
    tipo: DataTypes.STRING
  }, {
    tableName: 'usuarios'
  });

  return Usuario;
};
