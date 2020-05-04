const localStrategy = require('passport-local').Strategy
const sequelize = require('sequelize')
const bcrypt = require('bcryptjs')


const Usuario = require('../models/Usuario');

module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'login', passwordField:"senha"}, (login, senha, done) => {
        Usuario.findAll({
            where: {
                login: login
            }
        }).then((usuario) => {
            if(usuario.length == 0) {
                return done(null, false, {message: "Essa conta não existe"});
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                if(batem) {
                    return done(null, usuario);
                }else {
                    return done(null, false, {message: "Senha incorreta"});
                }
            })
        })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario);
        })
    })
}