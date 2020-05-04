const Sequelize = require('sequelize');

// Conexao bando de dados
    const sequelize = new Sequelize('crud', 'root', '', {
        host: 'localhost',
        dialect: 'mysql'
    });

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize,
}