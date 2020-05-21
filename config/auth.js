const localStrategy = require('passport-local').Strategy
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

                    done(null, false, { message: 'Usuário inexistente'})
                }
                bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                    if(batem) {
                        let data = new Date()
                        usuario.update({ ultimo_login: data},{
                            where: {
                                login: login
                            }
                        })
                        return done(null, usuario)
                    } else {
                        return done(null, false, { message: 'Senha incorreta'})
                    }
                })
            })
        }
    ))

    passport.serializeUser((usuario, done) => {
        done(null, { "nome": usuario.nome, "id": usuario.id, "tipo": usuario.tipo})
    })

    passport.deserializeUser((id, done) => {
        Usuario.findOne({
            where: {
                id: id.id
            }
            }).then((usuario) => {
                done(null, { "nome": usuario.nome, "id": usuario.id, "tipo": usuario.tipo})
            })  
    })
}