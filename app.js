const banco = require('./config/constantes')
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlebars = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs')
const Usuario = require('./models/Usuario');
const app = express();
const passport = require('passport');
const {acessos} = require('./helpers/acessos');
require('./config/auth')(passport);
app.use(express.json());
// Confugaração
    // SESSAO
        app.use(session({
            secret: "projetoNB",
            resave: true,
            saveUninitialized: true
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null;
            next();
        })
const urlencodeParser=bodyParser.urlencoded({extended:false});
const sql=mysql.createConnection({
   host:banco.host,
   user:banco.user,
   password:banco.password,
   port:3306
});
// escolhe qual db será usado
sql.query("use crud");

//Template engine
app.engine("handlebars",handlebars({defaultLayout:'main'}));
app.set('view engine','handlebars');

//Paginas estáticas
app.use('/css',express.static('css'));
app.use('/js',express.static('js'));
app.use('/img',express.static('img'));

// Tipo de usuario
let tipo = null

// Rotas
app.get("/:id?", acessos, function(req,res){
    tipo = req.user.tipo

	if(!req.params.id){
		let query = "SELECT * FROM produtos order by id"

	    sql.query(query, function(err,results,fields) {
	        res.render('index',{data:results, type: tipo});
	    })
	}else{
		let values = '%' + req.params.id + '%'

        let query = "SELECT * FROM produtos where nome LIKE ? order by id"

	    sql.query(query, values, function(err,results,fields) {
	        res.render('index',{data:results, busca:req.params.id});
	    })
    }
});

app.post("/cadastrarUsuario",urlencodeParser,function(req,res){
        if (tipo === 'admin') {
        
        // Procura algum usuario com o login desejado
        Usuario.findAll({ where: { login: req.body.usuario_cadastro } }).then(function(usuario) {
            if(usuario.length > 0) {  // verifica se já existe usuario com esse login
                res.render('loginUtilizado');
            }else{
        
        
                if (tipo  === 'admin'){
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
                    console.log(tipo_usuario);

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
                                tipo: tipo_usuario
                            }).then(function() {
                                res.render('cadastrarUsuario');
                            }).catch(function(erro) {
                                res.send('erro ao criar o usuario '+ erro);
                            });
                        })
                    })

                    
                
                } else {
                    res.render('sempermissao')
                }
            }
        })
    
    } else {
        res.render('sempermissao')
    }
});

app.post("/adicionar",urlencodeParser,function(req,res){ 
    if (tipo  === 'admin' || tipo  === 'gerente'){
        let nome = req.body.nome
        let desc = req.body.descricao
        let valor = req.body.valor
        let qntd = req.body.quantidade

        let values = [[nome, desc, valor, qntd]]

        let query = "INSERT INTO produtos (nome, descricao, valor, quantidade) VALUES ?"

        sql.query(query, [values], function(err) {
            if (err) throw err
        })
        res.render('adicionar',{nome:req.body.nome});
    
    } else {
        res.render('sempermissao')
    }
});

app.post("/vender",urlencodeParser,function(req,res){
    if (tipo  === 'admin' || tipo  === 'gerente' || tipo  === 'vendedor') {
        let id = req.body.idProdutoVenda
        let nome = req.body.nomeVenda
        let qntdEstoque = req.body.quantidadeEstoqueVenda
        let qntd = req.body.quantidadeVenda
        
        let transaction = "INSERT INTO transacoes (id, nome, quantidade) VALUES ?"

        sql.query(transaction, [[[id, nome, qntd]]], function (err) {
            if (err) throw err;
        })

        let values = [(qntdEstoque - qntd), id];

        let query = "UPDATE produtos SET quantidade = ? WHERE id = ?"

        sql.query(query, values, function(err) {
            if (err) throw err
        })
        res.render('vender');
    
    } else {
        res.render('sempermissao')
    }
});

app.post("/editarEstoque",urlencodeParser,function(req,res){
    if (tipo  === 'admin' || tipo  === 'gerente' || tipo  === 'editor') {

        let id = req.body.idProdutoEstoque
        let qntd = req.body.quantidadeEstoque

        let values = [qntd, id];

        let query = "UPDATE produtos SET quantidade = ? WHERE id = ?"

        sql.query(query, values, function(err) {
            if (err) throw err
        })
        res.render('editarEstoque');
    
    } else {
        res.render('sempermissao')
    }
});

app.post("/editar",urlencodeParser,function(req,res){
    if (tipo  === 'admin' || tipo  === 'gerente'){
        let id = req.body.idProdutoEditar
        let nome = req.body.nomeEditar
        let desc = req.body.descricaoEditar
        let valor = req.body.valorEditar

        let values = [nome, desc, valor, id];

        let query = "UPDATE produtos SET nome = ?, descricao = ?, valor = ? WHERE id = ?"

        sql.query(query, values, function(err) {
            if (err) throw err
        })
        res.render('editar');

    } else {
        res.render('sempermissao')
    }
});

app.get("/excluir/:id",function(req,res){
    if (tipo  === 'admin' || tipo  === 'gerente') {
        let values = req.params.id

        let query = "DELETE FROM produtos WHERE id = ?"

        sql.query(query, values, function(err) {
            if (err) throw err
        })
        res.render('excluir'); 
    
    } else {
        res.render('sempermissao')
    }
});

app.post("/transacoes", urlencodeParser, function (req, res) {

    let query = "SELECT * FROM transacoes";

    sql.query(query, function(err, results, fields) {
        res.render('transacoes', {data: results});
    })
})

app.post('/cadastro', urlencodeParser, function (req, res) {
    if (tipo  === 'admin') {
        res.render('cadastro')
    
    } else {
        res.render('sempermissao')
    }   
})

app.post("/home", urlencodeParser, function (req, res) {
    res.redirect('/')
})

app.post('/adicionarUsuario', function(req, res) {
});

app.get('/usuario/form', function(req, res) {
    res.render('login')
})

app.post('/usuario/login', urlencodeParser, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuario/form',
        failureFlash: true
    })(req, res, next)
})
app.get('/usuario/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'Deslogado com sucesso!')
    res.redirect('/usuario/form')
})

app.get('/usuario/registrar', (req, res) => {
    res.render('registrar')
})

app.post('/usuario/registrar', urlencodeParser, (req, res) => {
    var tipos = ['admin','gerente','vendedor','editor']
    //verifica senha
    if (req.body.senha != req.body.senha2) {
        res.send('senha diverge');
    } 
    
    // Procura algum usuario com o login desejado
    Usuario.findAll({ where: { login: req.body.login } }).then(function(usuario) {
        if(usuario.length > 0) {  // verifica se já existe usuario com esse login
            req.flash('successs_erro', 'O usuário já existe')
            res.render('registrar');
        }else{
            // gera senha
            bcrypt.genSalt(10, (erro, salt) => {
                bcrypt.hash(req.body.senha, salt, (erro, hash) => { //cria hash
                    if(erro) {
                        req.flash('successs_erro', 'Houve um erro ao cadastrar: '+erro)
                        res.render('registrar');
                    }
                    
                    // cria um usuario com os dados já conferidos
                    Usuario.create({
                        nome: req.body.nome,
                        login: req.body.login,
                        senha: hash,
                        tipo: 'admin'
                    }).then(function() {
                        req.flash('successs_msg', 'Usuario criado com sucesso!')
                        res.render('login');
                    }).catch(function(erro) {
                        res.send('erro ao criar o usuario '+ erro);
                    });
                })
            })
        }
    })
})

// app.get('/sempermissao', function (req, res) {
//     res.render('/')
// }) 

//Abrir servidor
app.listen(8000,function(req,res){
   console.log('Servidor aberto!');
});