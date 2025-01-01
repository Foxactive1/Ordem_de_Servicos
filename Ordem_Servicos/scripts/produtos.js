document.getElementById('produtoForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const nomeProduto = document.getElementById('nomeProduto').value;
    const preco = document.getElementById('preco').value;
    const descricao = document.getElementById('descricao').value;
    
    const produto = { nomeProduto, preco, descricao };
    
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.push(produto);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    
    listarProdutos();
    this.reset();
});

function listarProdutos() {
    const listaProdutos = document.getElementById('listaProdutos');
    listaProdutos.innerHTML = ''; // Limpa a lista para evitar duplicação

    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    produtos.forEach((produto, index) => {
        const li = document.createElement('li');
        li.textContent = `${produto.nomeProduto} - R$ ${produto.preco} - ${produto.descricao}`;
        
        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.addEventListener('click', () => removerProduto(index));
        
        li.appendChild(btnRemover);
        listaProdutos.appendChild(li);
    });
}

function removerProduto(index) {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.splice(index, 1); // Remove o produto pelo índice
    localStorage.setItem('produtos', JSON.stringify(produtos));
    listarProdutos(); // Atualiza a lista
}

// Chama a função para listar produtos ao carregar a página
listarProdutos();

