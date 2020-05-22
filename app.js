const db = require('./models/db.js');
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const passport = require('passport');
const {acessos} = require('./helpers/acessos');
const path = require('path');
require('./config/auth')(passport);
const usuario = require('./routes/usuario')
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
    // Public
        app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
//const urlencodeParser = bodyParser.urlencoded({extended:false});

//Template engine
app.engine("handlebars",handlebars({defaultLayout:'main'}));
app.set('view engine','handlebars');

// Tipo de usuario
let tipo = null
let id_usuario = null

// Rotas
    app.use('/usuario', usuario)




app.get("/:id?", acessos, function(req,res){
    tipo = req.user.tipo
    id_usuario = req.user.id

    let query2 = "SELECT * FROM carrinho where id_usuario = " + id_usuario
    db.sql.query(query2, function(err2,results2,fields2) {

        if(!req.params.id){
            let query = "SELECT * FROM produtos order by id"

            db.sql.query(query, function(err,results,fields) {
                res.render('index',{data:results, cart:results2});
            })
        }else{
            let values = '%' + req.params.id + '%'

            let query = "SELECT * FROM produtos where nome LIKE ? order by id"

            db.sql.query(query, values, function(err,results,fields) {
                res.render('index',{data:results, cart:results2, busca:req.params.id});
            })
        }

    })
});


app.post("/adicionar", function(req,res){ 
    // if (tipo  === 'admin' || tipo  === 'gerente'){
        let nome = req.body.nome
        let desc = req.body.descricao
        let valor = req.body.valor
        let qntd = req.body.quantidade
        let valorCusto = req.body.valorCusto

        let values = [nome, desc, valor, qntd, valorCusto]

        let query = "INSERT INTO produtos (nome, descricao, valor, quantidade, custo) VALUES ?"

        db.sql.query(query, [[values]], function(err) {
            if (err) {
                req.flash("error_msg", "Erro ao criar produto")
                throw err
            }
        })

        var user = {
            "nome": res.locals.user.nome,
            "id": res.locals.user.id
        }
        log_operation(nome, user, 'criar');
        req.flash("success_msg", "Produto criado com sucesso")
        res.redirect('/');
    
    // } else {
    //     res.render('sempermissao')
    // }
});

app.post("/adicionarCarrinho", function(req,res){
    // if (tipo  === 'admin' || tipo  === 'gerente' || tipo  === 'vendedor') {
        let id_produto = req.body.idProdutoVenda
        let nome = req.body.nomeVenda
        let qntd = req.body.quantidadeVenda
        let valor = req.body.valorVenda
        
        let query = "INSERT INTO carrinho (id_usuario, id_produto, nome, quantidade, valor) VALUES (?)"

        db.sql.query(query, [[id_usuario, id_produto, nome, qntd, valor]], function (err) {
            if (err) throw err;
        })
        res.render('adicionarCarrinho');
    
    // } else {
    //     res.render('sempermissao')
    // }
});

app.post("/removerCarrinho", function(req,res){
    // if (tipo  === 'admin' || tipo  === 'gerente' || tipo  === 'vendedor') {
        let id_produto = req.body.idProdutoVendaRemover
        
        let query = "DELETE FROM carrinho WHERE id_usuario = " + id_usuario + " AND id_produto = " + id_produto

        db.sql.query(query, function (err) {
            if (err) throw err;
        })
        res.render('removerCarrinho');
    
    // } else {
    //     res.render('sempermissao')
    // }
});

app.post("/exibirAleracao", function(req,res){
    let query = "SELECT count(*) AS 'count' FROM operacoes where id = " + req.body.id
    db.sql.query(query, function(err,results,fields) {
        qntdItens = results[0].count;
        if(qntdItens > 0){
            let query2 = "SELECT *, DATE_FORMAT(data, '%Y/%m/%d %H:%i:%s') AS datas FROM operacoes where id = " + req.body.id + " ORDER BY data DESC"
            console.log(query2);
            db.sql.query(query2, function(err2,results2,fields2) {
                let primeiro
                let segundo
                let vez = 0
                for(var i = 0; i < qntdItens; i++){
                    console.log(vez);
                    if(vez == 0){
                        if(results2[i].datas == req.body.data){
                            primeiro = i
                            vez++;
                        }
                    }else{
                        if(vez == 1){
                            segundo = i
                            vez++;
                        }
                    }
                }
                res.render('exibirAleracao',{primeiro:results2[primeiro], segundo:results2[segundo]});
            })
        }
    })
});

app.post("/vender", function(req,res){
    let query = "SELECT count(*) AS 'count' FROM carrinho where id_usuario = " + id_usuario
    db.sql.query(query, function(err,results,fields) {
        qntdItens = results[0].count;
        console.log(qntdItens);
        if(qntdItens > 0){
            let query2 = "SELECT * FROM carrinho where id_usuario = " + id_usuario
            db.sql.query(query2, function(err2,results2,fields2) {
                let id = []
                let nome = []
                let qntdEstoque
                let qntd = []
                let valor = []
                let query3
                let query4
                let a = 0
                for(var i = 0; i < qntdItens; i++){
                    id[i] = results2[i].id_produto;
                    nome[i] = results2[i].nome;
                    qntd[i] = results2[i].quantidade;
                    valor[i] = results2[i].valor;
                    query3 = "SELECT * FROM produtos where id = " + id[i]
                    console.log(id[i])
                    db.sql.query(query3, function(err3,results3,fields3) {
                        qntdEstoque = results3[0].quantidade;

                        query4 = "UPDATE produtos SET quantidade = " + (qntdEstoque - qntd[a]) + " WHERE id = " + id[a]
                        console.log(query4)

                        db.sql.query(query4, function(err4) {
                            if (err4) throw err4
                        })
                        query6 = "DELETE FROM carrinho WHERE id_produto = " + id[a]
                
                        db.sql.query(query6, function(err6) {
                            if (err6) {
                                req.flash("error_msg", "Erro ao editar os carrinhos")
                                throw err
                            }
                        })

                        var user = {
                            "nome": res.locals.user.nome,
                            "id": res.locals.user.id
                        }
                        var data = new Date();

                        query7 = "INSERT INTO vendas (id_usuario, dia, mes, ano, valor) VALUES (" + id_usuario + ", " + (data.getDay()) + ", " + (data.getMonth() + 1) + ", " + (data.getFullYear()) + ", " + (qntd[a] * valor[a]) + ")"
                
                        db.sql.query(query7, function(err7) {
                            if (err7) {
                                req.flash("error_msg", "Erro ao inserir venda")
                                throw err
                            }
                        })

                        log_operation(id[a], user, 'vender');
                        a++;
                    })
                }
            })
        }
        let query5 = "DELETE FROM carrinho WHERE id_usuario = " + id_usuario
        db.sql.query(query5, function(err5) {
            if (err5) throw err5
        })
    })
    
    res.render('vender');
});

app.post("/carrinho", function(req,res){


    let query = "SELECT * FROM carrinho where id_usuario = ? order by id_produto"

    db.sql.query(query, [id_usuario], function(err,results,fields) {
        res.render('carrinho',{data:results});
    })

});

app.post("/editarCarrinho", function(req,res){
    let id_produto = req.body.id_produtoCarrinho
    let qntd = req.body.quantidadeCarrinho
    let qntdTotal
    let suficiente = 's';

    if(qntd <= 0){
        let query = "DELETE FROM carrinho WHERE id_usuario = " + id_usuario + " AND id_produto = " + id_produto
    
        db.sql.query(query, function(err) {
            if (err) throw err
        })
        res.render('excluirCarrinho');
    }else{
        let query2 = "SELECT quantidade FROM produtos where id = " + id_produto
        db.sql.query(query2, function(err2,results2,fields2) {
            qntdTotal = results2[0].quantidade;
            if(qntd > qntdTotal){
                qntd = qntdTotal
                suficiente = 'n'
            }
            let values = [qntd, id_usuario, id_produto];
            let query = "UPDATE carrinho SET quantidade = ? WHERE id_usuario = ? AND id_produto = ?"

            db.sql.query(query, values, function(err) {
                if (err) throw err
            })
            res.render('editarCarrinho', {suficiente: suficiente});

        })
    }
});

app.post("/excluirCarrinho", function(req,res){
    let id_produto = req.body.id_produtoCarrinho2

    let query = "DELETE FROM carrinho WHERE id_usuario = " + id_usuario + " AND id_produto = " + id_produto
    
    db.sql.query(query, function(err) {
        if (err) throw err
    })
    res.render('excluirCarrinho');
});

app.post("/editarEstoque", function(req,res){
    // if (tipo  === 'admin' || tipo  === 'gerente' || tipo  === 'editor') {

        let id = req.body.idProdutoEstoque
        let qntd = req.body.quantidadeEstoque

        let values = [qntd, id];

        let query = "UPDATE produtos SET quantidade = ? WHERE id = ?"

        db.sql.query(query, values, function(err) {
            if (err) {
                req.flash("error_msg", "Erro ao editar estoque")
                throw err
            }
        })
        query = "DELETE FROM carrinho WHERE id_produto = " + id

        db.sql.query(query, function(err) {
            if (err) {
                req.flash("error_msg", "Erro ao editar os carrinhos")
                throw err
            }
        })

        var user = {
            "nome": res.locals.user.nome,
            "id": res.locals.user.id
        }
        log_operation(id, user, 'estocar');

        req.flash("success_msg", "Estoque editado com sucesso")
        res.redirect('/');
    
    // } else {
    //     res.render('sempermissao')
    // }
});

app.post("/editar", function(req,res){
    // if (tipo  === 'admin' || tipo  === 'gerente'){
        let id = req.body.idProdutoEditar
        let nome = req.body.nomeEditar
        let desc = req.body.descricaoEditar
        let valor = req.body.valorEditar
        let valorCusto = req.body.valorCustoEditar

        let values = [nome, desc, valor, valorCusto, id];

        let query = "UPDATE produtos SET nome = ?, descricao = ?, valor = ?, custo = ? WHERE id = ?"

        db.sql.query(query, values, function(err) {
            if (err) {
                req.flash("error_msg", "Erro ao editar produto")
                throw err
            }
        })

        var user = {
            "nome": res.locals.user.nome,
            "id": res.locals.user.id
        }
        log_operation(id, user, 'editar');

        req.flash("success_msg", "Produto editado com sucesso")
        res.redirect('/');

    // } else {
    //     res.render('sempermissao')
    // }
});

app.get("/excluir/:id",function(req,res){
    // if (tipo  === 'admin' || tipo  === 'gerente') {
        let id = req.params.id

        var user = {
            "nome": res.locals.user.nome,
            "id": res.locals.user.id
        }
        log_operation(id, user, 'excluir');

        let query = "DELETE FROM produtos WHERE id = ?"

        db.sql.query(query, id, function(err) {
            if (err) {
                req.flash("error_msg", "Erro ao excluir produto")
                throw err
            }
        })

        query = "DELETE FROM carrinho WHERE id_produto = " + id

        db.sql.query(query, function(err) {
            if (err) {
                req.flash("error_msg", "Erro ao editar os carrinhos")
                throw err
            }
        })

        req.flash("success_msg", "Produto excluído com sucesso")
        res.redirect('/');
    
    // } else {
    //     res.render('sempermissao')
    // }
});

app.post("/operacoes", acessos, function (req, res) {
    // log_operation('Sistema', res.locals.user.nome, 'criar');

    let query = "SELECT *, DATE_FORMAT(data, '%Y/%m/%d %H:%i:%s') as data FROM operacoes order by data DESC";

    db.sql.query(query, function(err, results, fields) {
        res.render('operacoes', {data: results});
    })
})

app.post('/cadastro', function (req, res) {
    if (tipo  === 'admin') {
        res.render('cadastro')
    
    } else {
        res.render('sempermissao')
    }   
})

app.post("/home", function (req, res) {
    res.redirect('/')
})



function log_operation (val, user, operation) {
    if (operation === 'criar') {
        let query = "SELECT * FROM produtos WHERE nome = ?";
   
        db.sql.query(query, val, function (err, results) {
            if (err) throw err;

            let values = [
                user.id,
                user.nome,
                results[0].id,
                results[0].nome,
                results[0].descricao,
                results[0].quantidade,
                results[0].valor,
                results[0].custo,
                operation
            ];

            let op = "INSERT INTO operacoes (id_user, usuario, id, produto, descricao, quantidade, valor, custo, operacao) VALUES ? ";

            db.sql.query(op, [[values]], function (err) {
                if (err) throw err;
            });
        });
    
    } else {
        let query = "SELECT * FROM produtos WHERE id = ?";
        
        db.sql.query(query, val, function (err, results) {
            if (err) throw err;

            let values = [
                user.id,
                user.nome,
                results[0].id,
                results[0].nome,
                results[0].descricao,
                results[0].quantidade,
                results[0].valor,
                results[0].custo,
                operation
            ];

            let op = "INSERT INTO operacoes (id_user, usuario, id, produto, descricao, quantidade, valor, custo, operacao) VALUES ? ";

            db.sql.query(op, [[values]], function (err) {
                if (err) throw err;
            });   
        });
    }
}

//Abrir servidor
app.listen(8000,function(req,res){
   console.log('Servidor aberto!');
});