const localStrategy = require('passport-local').Strategy
const sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario');

/*
Usuario.findOne({ where: {login: 'itter'}}).then((usuario) => {
    if (!usuario) { 
        console.log('n tem')
    }else {
        console.log(usuario.id)
        console.log(usuario.senha)
    }
}) 
*/

module.exports = function(passport) {
    passport.use(new localStrategy({ 
            usernameField: 'login_login', 
            passwordField: 'senha_login'
        }, (login, senha, done) => {

            // busca um usuário no banco de dados
            Usuario.findOne({ where: {login: login}}).then((usuario) => {
                if (!usuario) {
                    done(null, false, { message: 'usuario inexistente'})
                }
                bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                    if(batem) {
                        return done(null, usuario)
                    } else {
                        return done(null, false, { message: 'senha incorreta'})
                    }
                })
            })
        }
    ))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findOne({
            where: {
                id: id
            }
            }).then((usuario) => {
                done(null, usuario.id)
            })  
    })
}