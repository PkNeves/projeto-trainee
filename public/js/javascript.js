//JS do Modal
function mostrarModal(){
	document.getElementById('modal').classList.add('show');
	limparModal();
}
function mostrarModal2(){
	document.getElementById('modal').classList.add('show');
}
function esconderModal(){
	document.getElementById('modal').classList.remove('show');
}
function limparModal(){
	document.getElementById('adicionarProduto').style.display = 'none';
	document.getElementById('buscarProduto').style.display = 'none';
	document.getElementById('venderProduto').style.display = 'none';
	document.getElementById('editarEstoque').style.display = 'none';
	document.getElementById('editarProduto').style.display = 'none';
	document.getElementById('excluirProduto').style.display = 'none';
	document.getElementById('cadastroUsuario').style.display = 'none';
}

//JS para adicionar ao carrinho
function adicionarCarrinho(id){
	document.getElementById('idProdutoVenda').value = document.getElementById('id' + id).value;
	document.getElementById('nomeVenda').value = document.getElementById('nome' + id).value;
	document.getElementById('valorVenda').value = document.getElementById('valor' + id).value;
	document.getElementById('quantidadeEstoqueVenda').value = document.getElementById('quantidade' + id).value;
	document.getElementById('quantidadeVenda').max = document.getElementById('quantidade' + id).value;
}

//JS para remover do carrinho
function removerCarrinho(id){
	document.getElementById('idProdutoVendaRemover').value = document.getElementById('id' + id).value;
	document.getElementById('nomeVendaRemover').value = document.getElementById('nome' + id).value;
	document.getElementById('valorVendaRemover').value = document.getElementById('valor' + id).value;
	document.getElementById('quantidadeEstoqueVendaRemover').value = document.getElementById('quantidade' + id).value;
}

//JS para editar estoque
function editarEstoque(id){
	document.getElementById('idProdutoEstoque').value = document.getElementById('id' + id).value;
	document.getElementById('nomeEstoque').value = document.getElementById('nome' + id).value;
	document.getElementById('quantidadeEstoque').value = document.getElementById('quantidade' + id).value;
}

//JS para editar produto
function editarProduto(id){
	document.getElementById('idProdutoEditar').value = document.getElementById('id' + id).value;
	document.getElementById('nomeEditar').value = document.getElementById('nome' + id).value;
	document.getElementById('descricaoEditar').value = document.getElementById('descricao' + id).value;
	document.getElementById('valorEditar').value = document.getElementById('valor' + id).value;
	document.getElementById('valorCustoEditar').value = document.getElementById('valorCusto' + id).value;
}

//JS para excluir
function excluirProduto(id){
	document.getElementById('idProdutoExcluir').value = document.getElementById('id' + id).value;
	document.getElementById('nomeExcluir').value = document.getElementById('nome' + id).value;
	document.getElementById('descricaoExcluir').value = document.getElementById('descricao' + id).value;
	document.getElementById('valorExcluir').value = document.getElementById('valor' + id).value;
	document.getElementById('valorCustoExcluir').value = document.getElementById('valorCusto' + id).value;
	document.getElementById('quantidadeExcluir').value = document.getElementById('quantidade' + id).value;
}

//JS para editar quantidade no carrinho
function editarQuantidadeCarrinho(id){
	document.getElementById('id_produtoCarrinho').value = document.getElementById('id' + id).value;
	document.getElementById('nome_produtoCarrinho').value = document.getElementById('nome' + id).value;
	document.getElementById('quantidadeCarrinho').value = document.getElementById('quantidade' + id).value;
}

//JS para excluir produto no carrinho
function excluirQuantidadeCarrinho(id){
	document.getElementById('id_produtoCarrinho2').value = document.getElementById('id' + id).value;
	document.getElementById('nome_produtoCarrinho2').value = document.getElementById('nome' + id).value;
}

//Verificar senhas
function validaSenhas(senha1, senha2){
	if(senha1 != senha2){
		alert('As senhas devem ser iguais');
		return false;
	}else{
		return true;
	}
}