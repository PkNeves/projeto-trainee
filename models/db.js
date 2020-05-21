const banco = require('../config/constantes')
const Sequelize = require('sequelize');

// Conexao bando de dados
    const sequelize = new Sequelize(banco.db, banco.user, banco.password, {
        host: banco.host,
        dialect: 'mysql'
    });

    // Verificação informativa de conexao com o banco
    sequelize.authenticate().then(() => {
        console.log("Conectado ao banco via sequelize")
    }).catch((error) => {
        console.log("Falaha ao conectar com o banco via sequelize. Erro: " + error)
    })

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize,
}