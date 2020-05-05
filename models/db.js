const banco = require('../config/constantes')
const Sequelize = require('sequelize');

// Conexao bando de dados
    const sequelize = new Sequelize(banco.db, banco.user, banco.password, {
        host: banco.host,
        dialect: 'mysql'
    });

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize,
}