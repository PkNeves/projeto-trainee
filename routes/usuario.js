const express = require('express')
const router = express.Router()
const {acessos} = require('../helpers/acessos');
const passport = require('passport');
const Usuario = require('../models/Usuario');
const db = require('../models/db.js');
const bcrypt = require('bcryptjs');
const pdf = require ("html-pdf");

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

router.post('/emitirPDF', (req, res) => {
    let id_user = req.body.id_usuario;
    var data = new Date();
    var mes_atual = data.getMonth() + 1
    var ano_atual = data.getFullYear(); 
    if(mes_atual == 1){
        var mes_anterior = 12;
        var ano_anterior = ano_atual - 1; 
    }else{
        var mes_anterior = mes_atual - 1;
        var ano_anterior = ano_atual; 
    }


    Usuario.findAll({
        where: {
            id: id_user
        }
    }).then(users => {
        var query_mes_anterior = "SELECT SUM(valor) as valor FROM vendas WHERE id_usuario =" + id_user + " and mes = " + mes_anterior + " and ano = " + ano_atual
        var query_mes_atual = "SELECT SUM(valor) as valor FROM vendas WHERE id_usuario =" + id_user + " and mes = " + mes_atual + " and ano = " + ano_anterior
        var query_menor_ano = "SELECT Min(ano) as ano FROM vendas WHERE id_usuario =" + id_user
        var query_operacoes = "SELECT *, DATE_FORMAT(data, '%H:%i %d/%m/%Y') as data FROM operacoes WHERE id_user = " + id_user + " ORDER BY data DESC;";

        console.log('query_anteior' + query_mes_anterior)
        db.sql.query(query_mes_anterior, function(err, dados_mes_anterior, fields) {
            db.sql.query(query_mes_atual, function(err, dados_mes_atual, fields) {
                db.sql.query(query_menor_ano, function(err, dados_menor_ano, fields) {
                    db.sql.query(query_operacoes, function(err, dados_operacoes, fields) {
                        console.log(dados_operacoes)


                        var html = `
                        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
                        <div style="font-family: Raleway; width: 688px; margin-left: 48px;">
                            <label style="float: right">` 
                            
                            var dataAtuall = new Date();
                            var essaData = dataAtuall.getHours() + ":" + dataAtuall.getMinutes() + ":" + dataAtuall.getSeconds() +  " - " + dataAtuall.getDate() + "/" + (dataAtuall.getMonth() + 1) + "/" + dataAtuall.getFullYear();
                            html += essaData
                            html += `</label><label style="float: left"><b>Projeto CRUD</b></label>
                            <br><br><br><h3>Usuário: ${users[0].dataValues.nome}</h3>
                            <br><br><h3>Dados</h3>
                            <table class='table table-striped'>
                                <thead class='thead-dark'>
                                    <th>Nome</th>
                                    <th>Criado em</th>
                                    <th>Ultimo Login</th>
                                    <th>Salário Mensal</th>
                                    <th>Vendas Mês Anterior</th>
                                    <th>Vendas Mês atual</th>
                                </thead>
                        
                                <tbody>
                                    <tr>    
                                        <td>
                                            ${users[0].dataValues.nome}
                                        </td>
                                        <td>
                                            ${users[0].dataValues.createdAt}
                                        </td>
                                        <td>
                                            ${users[0].dataValues.ultimo_login}
                                        </td>
                                        <td>
                                            R$ ${users[0].dataValues.salario_mensal}
                                        </td>
                                        <td>
                                            R$ ${dados_mes_anterior[0].valor}
                                        </td>
                                        <td>
                                            R$ ${dados_mes_atual[0].valor}
                                        </td>
                                </tbody>
                            </table>

                            <br><br><h3>Operações</h3>

                            <table class='table table-striped'>
                                <thead class='thead-dark'>
                                    <th>Produto</th>
                                    <th>Quantidade</th>
                                    <th>Custo</th>
                                    <th>Valor</th>
                                    <th>Operação</th>
                                    <th>Data</th>
                                </thead>

                                <tbody>`;

                                    for(var i = 0; i < dados_operacoes.length; i++){
                                        html += `<tr>
                                                    <td> ${ dados_operacoes[i].produto } </td>
                                                    <td> ${ dados_operacoes[i].quantidade } </td>
                                                    <td> ${ dados_operacoes[i].custo } </td>
                                                    <td> ${ dados_operacoes[i].valor } </td>
                                                    <td> ${ dados_operacoes[i].operacao } </td>
                                                    <td> ${ dados_operacoes[i].data } </td>
                                                </tr>`
                                    }
                                html += `
                                </tbody>

                            </table>
                        </div>
                        `;
                        pdf.create(html, {}).toFile("./views/usuario/dadosUsuario.pdf",(err, res) => {
                            if(err){
                                console.log("Erro");
                            }else{
                                console.log(res);
                            }
                        })
                        res.render("usuario/mostrarPDF")


                    })          
                })          
            })
        })
    });



    
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

router.post("/graficoMensal", acessos, function (req, res) {
    var id = req.body.id_usuario;
    var mes = req.body.mes_grafico;
    var ano = req.body.ano_grafico;
    let query = "SELECT * FROM vendas where id_usuario = " + id + " and mes = " +  + mes + " and ano = " + ano + " order by dia";
    console.log("\n\n\n\n"+query);

    db.sql.query(query, function(err, results, fields) {
        res.render('usuario/graficoMensal', {data: results, omes: mes, oano: ano, oid: id});
    })
})

router.post("/graficoAnual", acessos, function (req, res) {
    var id = req.body.id_usuario;
    var ano = req.body.ano_grafico;
    let query = "SELECT * FROM vendas where id_usuario = " + id + " and ano = " + ano + " order by mes";
    console.log("\n\n\n\n"+query);

    db.sql.query(query, function(err, results, fields) {
        res.render('usuario/graficoAnual', {data: results, oano: ano, oid: id});
    })
})

router.get('/info/:id', (req, res) => {
    var id_user = req.params.id
    var data = new Date();
    var mes_atual = data.getMonth() + 1
    var ano_atual = data.getFullYear(); 
    if(mes_atual == 1){
        var mes_anterior = 12;
        var ano_anterior = ano_atual - 1; 
    }else{
        var mes_anterior = mes_atual - 1;
        var ano_anterior = ano_atual; 
    }


    Usuario.findAll({
        where: {
            id: id_user
        }
    }).then(users => {
        var query_mes_anterior = "SELECT SUM(valor) as valor FROM vendas WHERE id_usuario =" + id_user + " and mes = " + mes_anterior + " and ano = " + ano_atual
        var query_mes_atual = "SELECT SUM(valor) as valor FROM vendas WHERE id_usuario =" + id_user + " and mes = " + mes_atual + " and ano = " + ano_anterior
        var query_menor_ano = "SELECT Min(ano) as ano FROM vendas WHERE id_usuario =" + id_user
        var query_operacoes = "SELECT *, DATE_FORMAT(data, '%H:%i %d/%m/%Y') as data FROM operacoes WHERE id_user = " + id_user + " ORDER BY data DESC;";

        console.log('query_anteior' + query_mes_anterior)
        db.sql.query(query_mes_anterior, function(err, dados_mes_anterior, fields) {
            db.sql.query(query_mes_atual, function(err, dados_mes_atual, fields) {
                db.sql.query(query_menor_ano, function(err, dados_menor_ano, fields) {
                    db.sql.query(query_operacoes, function(err, dados_operacoes, fields) {
                        console.log(dados_operacoes)

                        res.render('usuario/info', {
                            id_usuario: id_user,
                            user: users[0], 
                            mes_anterior: dados_mes_anterior[0], 
                            mes_atual: dados_mes_atual[0], 
                            menor_ano: dados_menor_ano[0],
                            operacoes: dados_operacoes,
                        })
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