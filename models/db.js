const banco = require('../config/constantes')
const Sequelize = require('sequelize');
const mysql = require('mysql');

// Conexao usando Sequelize 
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

// Conexao usando sql
    const sql = mysql.createConnection({
        host:banco.host,
        user:banco.user,
        password:banco.password,
        port:3306
    });
    // escolhe qual db será usado
    sql.query("use crud");

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    sql: sql
}