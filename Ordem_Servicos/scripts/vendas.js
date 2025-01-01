document.getElementById('vendaForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const cliente = document.getElementById('cliente').value;
    const produto = document.getElementById('produto').value;
    const quantidade = document.getElementById('quantidade').value;
    
    const venda = { cliente, produto, quantidade };
    
    let vendas = JSON.parse(localStorage.getItem('vendas')) || [];
    vendas.push(venda);
    localStorage.setItem('vendas', JSON.stringify(vendas));
    
    listarVendas();
    this.reset();
});

function listarVendas() {
    const listaVendas = document.getElementById('listaVendas');
    listaVendas.innerHTML = ''; // Limpa a lista para evitar duplicação

    let vendas = JSON.parse(localStorage.getItem('vendas')) || [];

    vendas.forEach((venda, index) => {
        const li = document.createElement('li');
        li.textContent = `Cliente: ${venda.cliente}, Produto: ${venda.produto}, Quantidade: ${venda.quantidade}`;
        
        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.addEventListener('click', () => removerVenda(index));
        
        li.appendChild(btnRemover);
        listaVendas.appendChild(li);
    });
}

function removerVenda(index) {
    let vendas = JSON.parse(localStorage.getItem('vendas')) || [];
    vendas.splice(index, 1); // Remove a venda pelo índice
    localStorage.setItem('vendas', JSON.stringify(vendas));
    listarVendas(); // Atualiza a lista
}

function carregarClientesEProdutos() {
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    
    const clienteSelect = document.getElementById('cliente');
    const produtoSelect = document.getElementById('produto');
    
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.nome;
        option.textContent = cliente.nome;
        clienteSelect.appendChild(option);
    });
    
    produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.nomeProduto;
        option.textContent = produto.nomeProduto;
        produtoSelect.appendChild(option);
    });
}

// Chama a função para listar vendas e carregar clientes/produtos ao carregar a página
listarVendas();
carregarClientesEProdutos();

