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
        type: db.Sequelize.ENUM('admin','gerente','vendedor','editor'),
        allowNull: false
    },
    salario_mensal: {
        type: db.Sequelize.DECIMAL(10,2),
        allowNull: false
    },
    ultimo_login: {
        type: db.Sequelize.DATE(),
        allowNull: true
    }
});


//Usuario.sync({force: true});
module.exports = Usuario;