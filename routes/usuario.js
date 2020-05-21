const express = require('express')
const router = express.Router()
const {acessos} = require('../helpers/acessos');
const passport = require('passport');
const Usuario = require('../models/Usuario');
const db = require('../models/db.js');
const bcrypt = require('bcryptjs')

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuario/form',
        failureFlash: true
    })(req, res, next)
})

router.post("/cadastrar", function(req, res) {
        // if (tipo === 'admin') {
        
        // Procura algum usuario com o login desejado
        Usuario.findAll({ where: { login: req.body.usuario_cadastro } }).then(function(usuario) {
            if(usuario.length > 0) {  // verifica se já existe usuario com esse login
                res.render('loginUtilizado');
            } else {
                if (res.locals.user.tipo  === 'admin'){
                    let tipo_usuario = req.body.tipo_cadastro
                    if(tipo_usuario == 0){
                        tipo_usuario = 'admin'
                    }
                    if(tipo_usuario == 1){
                        tipo_usuario = 'gerente'
                    }
                    if(tipo_usuario == 2){
                        tipo_usuario = 'vendedor'
                    }
                    if(tipo_usuario == 3){
                        tipo_usuario = 'editor'
                    }
                    let nome = req.body.nome_cadastro
                    let usuario = req.body.usuario_cadastro
                    let senha = req.body.senha1_cadastro
                    let salario = req.body.salario_cadastro

                    bcrypt.genSalt(10, (erro, salt) => {
                        bcrypt.hash(senha, salt, (erro, hash) => { //cria hash
                            if(erro) {
                                res.send('houve um erro');
                            }
                            
                            // cria um usuario com os dados já conferidos
                            Usuario.create({
                                nome: nome,
                                login: usuario,
                                senha: hash,
                                tipo: tipo_usuario,
                                salario_mensal: salario
                            }).then(function(usuario) {
                                var data = {
                                    "id": res.locals.user.id,
                                    "nome": res.locals.user.nome,
                                    "id_mod": usuario.id,
                                    "nome_mod": usuario.nome
                                }
                                log_user(data, 'criar')
                                req.flash("success_msg", "Usuário criado com sucesso")
                                res.redirect('/')
                            }).catch(function(erro) {
                                res.send('erro ao criar o usuario '+ erro);
                            });
                        })
                    })
                } else {
                    req.flash("error_msg", "Você não tem permissão pra cadastrar um usuário")
                    res.redirect('/')
                }
            }
        })
});

router.get('/form', function(req, res) {
    res.render('login')
})


router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'Deslogado com sucesso!')
    res.redirect('/usuario/form')
})

router.post('/ccadastrar', (req, res) => {

    //verifica senha
    if (req.body.senha1_cadastro != req.body.senha2_cadastro) {
        req.flash('error_msg','senha diverge');
        res.redirect('/')
    } 
    
    // Procura algum usuario com o login desejado
    Usuario.findAll({ where: { login: req.body.login_cadastro } }).then(function(usuario) {
        if (usuario.length > 0) {  // verifica se já existe usuario com esse login
            req.flash('successs_erro', 'O usuário já existe')
            res.redirect('/');
        } else {
            // gera senha
            bcrypt.genSalt(10, (erro, salt) => {
                bcrypt.hash(req.body.senha1_cadastro, salt, (erro, hash) => { //cria hash
                    if(erro) {
                        req.flash('successs_erro', 'Houve um erro ao cadastrar: '+ erro)
                        res.redirect('/');
                    }

                    var tipos = ['admin', 'gerente', 'vendedor', 'editor']
                    
                    // cria um usuario com os dados já conferidos
                    Usuario.create({
                        nome: req.body.nome_cadastro,
                        login: req.body.login_cadastro,
                        senha: hash,
                        tipo: tipos[tipo_cadastro] 
                    }).then(function(usuario) {
                        let data = {
                            'id': res.locals.user.id,
                            'nome': res.locals.user.nome,
                        }
                        log_user(data, 'criar')
                        req.flash('successs_msg', 'Usuario criado com sucesso!')
                        res.redirect('/');
                    }).catch(function(erro) {
                        res.send('erro ao criar o usuario '+ erro);
                    });
                })
            })
        }
    })
})

router.get('/listar', acessos,  (req, res) => {
    Usuario.findAll().then(function(usuarios) { 
        console.log(usuarios);
        res.render('usuario/listar', {usuarios: usuarios})
    })
})

router.post('/excluir/:id', (req, res) => {
        var dados = {
            'id': res.locals.user.id,
            'nome': res.locals.user.nome,
            'id_mod': req.params.id
        }

        log_user(dados, 'excluir')
        // Deleta o usuario
        Usuario.destroy({
            where: {
                id: dados.id_mod
            }
        }).then(function() { 
            req.flash("success_msg", "Usuário excluído com sucesso")
            res.redirect('/usuario/listar')
        })
})

router.post('/editar', (req, res) => {

    var tipos = ['admin', 'gerente', 'vendedor', 'editor'];

    // parametros recebidos pelo corpo
    var id = req.body.id_usuario
    var senha1 = req.body.senha1_usuario
    var senha2 = req.body.senha2_usuario
    var nome = req.body.nome_usuario
    var salario = req.body.salario_usuario
    var login = req.body.login_usuario
    var tipo = (req.body.tipo_usuario) ? req.body.tipo_usuario : false 

    // variavel com as informações pra salvar o log de Usuarios 
    var dados = {
        'id': res.locals.user.id,
        'nome': res.locals.user.nome,
        'id_mod': id,
        'nome_mod': nome
    }

    // Verifica se foi digitado algo na senha
    if (senha1 != '' && senha2 != '') {
        // Verifica se as senhas conferem
        if (senha1 == senha2) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(senha1, salt);
            // Verifica o tipo, pois pode estar como disabled
            if (tipo) {
                log_user(dados, 'editar')
                Usuario.update({ 
                        nome: nome,
                        login: login,
                        senha: hash,
                        tipo: tipos[tipo],
                        salario_mensal: salario
                        }, {
                        where: {
                            id: id
                        }
                    }).then(() => {
                        req.flash("success_msg", "Os dados do usuário foram atualizados")
                        res.redirect('/usuario/listar')
                });
            } else {
                log_user(dados, 'editar')
                Usuario.update({ 
                        nome: nome,
                        login: login,
                        salario_mensal: salario,
                        senha: hash
                        }, {
                        where: {
                            id: id
                        }
                    }).then(() => {
                        req.flash("success_msg", "Os dados do usuário foram atualizados")
                        res.redirect('/usuario/listar')
                });
            }
        }
    } 
    // atualiza usuario sem mudar a senha 
    else {
        if (tipo) {
            log_user(dados, 'editar')
            Usuario.update({ 
                    nome: nome,
                    login: login,
                    salario_mensal: salario,
                    tipo: tipos[tipo]
                    }, {
                    where: {
                        id: id
                    }
                }).then(() => {
                    req.flash("success_msg", "Os dados do usuário foram atualizados")
                    res.redirect('/usuario/listar')
            });
        } else {
            log_user(dados, 'editar')
            Usuario.update({ 
                    nome: nome,
                    salario_mensal: salario,
                    login: login
                    }, {
                    where: {
                        id: id
                    }
                }).then(() => {
                    req.flash("success_msg", "Os dados do usuário foram atualizados")
                    res.redirect('/usuario/listar')
            });
        }
    }
})

router.post("/operacoes", acessos, function (req, res) {
    // log_operation('Sistema', res.locals.user.nome, 'criar');

    let query = "SELECT *, DATE_FORMAT(data, '%Y/%m/%d %H:%i:%s') as data FROM operacoes_usuarios order by data DESC";

    db.sql.query(query, function(err, results, fields) {
        res.render('usuario/operacoes', {data: results});
    })
})

router.get('/info/:id', (req, res) => {
    var id_user = req.params.id
    var data = new Date();
    var mes_atual = data.getMonth() + 1 
    var mes_anterior = mes_atual - 1; 


    Usuario.findAll({
        where: {
            id: id_user
        }
    }).then(users => {
        var query_mes_anterior = "SELECT SUM(quantidade*valor) as valor FROM operacoes WHERE id_user =" + id_user + " and MONTH(data) = " + mes_anterior + " and operacao = 'vender'"
        var query_mes_atual = "SELECT SUM(quantidade*valor) as valor FROM operacoes WHERE id_user =" + id_user + " and MONTH(data) = " + mes_atual + " and operacao = 'vender'"
        var query_operacoes = "SELECT *, DATE_FORMAT(data, '%H:%i %d/%m/%Y') as data FROM operacoes WHERE id_user = " + id_user + " ORDER BY data DESC;";

        console.log('query_anteior' + query_mes_anterior)
        db.sql.query(query_mes_anterior, function(err, dados_mes_anterior, fields) {
            db.sql.query(query_mes_atual, function(err, dados_mes_atual, fields) {
                db.sql.query(query_operacoes, function(err, dados_operacoes, fields) {
                    console.log(dados_operacoes)

                    res.render('usuario/info', {
                        user: users[0], 
                        mes_anterior: dados_mes_anterior[0], 
                        mes_atual: dados_mes_atual[0], 
                        operacoes: dados_operacoes,
                    })
                })          
            })
        })
    });
})

function log_user(dados, operacao) {

    if (operacao == 'excluir') {
        // Acha o usuario
        Usuario.findAll({
            where: {
                id: dados.id_mod
            }
        }).then((usuario) => {
            let values = [
                dados.id,
                dados.nome,
                usuario[0].id,
                usuario[0].nome,
                "excluir"
            ]
            // Se o usuario for achado, insere na tabela de operacoes
            let query = "INSERT INTO operacoes_usuarios (id_usuario, nome_usuario, id_usuario_modificado, nome_usuario_modificado, operacao) VALUES ?" 
            
            db.sql.query(query, [[values]], function (err) {
                if (err) throw err;
            });
        })
    } else if (operacao == 'editar') {
            let values = [
                dados.id,
                dados.nome,
                dados.id_mod,
                dados.nome_mod,
                "editar"
            ]
            // Se o usuario for achado, insere na tabela de operacoes
            let query = "INSERT INTO operacoes_usuarios (id_usuario, nome_usuario, id_usuario_modificado, nome_usuario_modificado, operacao) VALUES ?" 
            
            db.sql.query(query, [[values]], function (err) {
                if (err) throw err;
            });

    } else if (operacao = 'criar') {
        let values = [
            dados.id,
            dados.nome,
            dados.id_mod,
            dados.nome_mod,
            "criar"
        ]
        // Se o usuario for achado, insere na tabela de operacoes
        let query = "INSERT INTO operacoes_usuarios (id_usuario, nome_usuario, id_usuario_modificado, nome_usuario_modificado, operacao) VALUES ?" 
        
        db.sql.query(query, [[values]], function (err) {
            if (err) throw err;
        });
    }
}


module.exports = router