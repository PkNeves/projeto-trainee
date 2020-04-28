const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlebars = require('express-handlebars');
const app = express();
const urlencodeParser=bodyParser.urlencoded({extended:false});
const sql=mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'',
   port:3306
});
sql.query("use estoquenb");

//Template engine
app.engine("handlebars",handlebars({defaultLayout:'main'}));
app.set('view engine','handlebars');

app.use('/css',express.static('css'));
app.use('/js',express.static('js'));
app.use('/img',express.static('img'));

//Rotas
app.get("/:id?",function(req,res){
	if(!req.params.id){
		let query = "SELECT * FROM produtos order by id"

	    sql.query(query, function(err,results,fields) {
	        res.render('index',{data:results});
	    })
	}else{
		let values = '%' + req.params.id + '%'

        let query = "SELECT * FROM produtos where nome LIKE ? order by id"

	    sql.query(query, values, function(err,results,fields) {
	        res.render('index',{data:results, busca:req.params.id});
	    })
    }
});
app.post("/adicionar",urlencodeParser,function(req,res){
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
});

app.post("/vender",urlencodeParser,function(req,res){
	let id = req.body.idProdutoVenda
	let qntdEstoque = req.body.quantidadeEstoqueVenda
	let qntd = req.body.quantidadeVenda

    let values = [(qntdEstoque - qntd), id];

    let query = "UPDATE produtos SET quantidade = ? WHERE id = ?"

    sql.query(query, values, function(err) {
        if (err) throw err
    })
    res.render('vender');
});

app.post("/editarEstoque",urlencodeParser,function(req,res){
	let id = req.body.idProdutoEstoque
	let qntd = req.body.quantidadeEstoque

    let values = [qntd, id];

    let query = "UPDATE produtos SET quantidade = ? WHERE id = ?"

    sql.query(query, values, function(err) {
        if (err) throw err
    })
    res.render('editarEstoque');
});

app.post("/editar",urlencodeParser,function(req,res){
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
});

app.get("/excluir/:id",function(req,res){
	let values = req.params.id

    let query = "DELETE FROM produtos WHERE id = ?"

    sql.query(query, values, function(err) {
        if (err) throw err
    })
    res.render('excluir');
});

//Abrir servidor
app.listen(8000,function(req,res){
   console.log('Servidor aberto!');
});