const db = require('./db.js');

const Usuario = db.sequelize.define('usuarios', {
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    login: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    tipo: {
        type: db.Sequelize.ENUM('administrador','gerente','vendedor','editor','cliente'),
        allowNull: false
    }
});


//Usuario.sync({force: true});
module.exports = Usuario;