document.getElementById('clienteForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();

    // Verificação básica para garantir que os campos não estão vazios
    if (!nome || !telefone || !email) {
        alert("Todos os campos são obrigatórios.");
        return;
    }
    
    // Verifica se o telefone contém apenas números
    if (!/^\d+$/.test(telefone)) {
        alert("O telefone deve conter apenas números.");
        return;
    }
    
    const cliente = { nome, telefone, email };
    
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    clientes.push(cliente);
    localStorage.setItem('clientes', JSON.stringify(clientes));
    
    listarClientes();
    this.reset(); // Limpa o formulário após o envio
});

function listarClientes() {
    const listaClientes = document.getElementById('listaClientes');
    listaClientes.innerHTML = ''; // Limpa a lista para evitar duplicação

    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

    clientes.forEach((cliente, index) => {
        const li = document.createElement('li');
        li.textContent = `${cliente.nome} - ${cliente.telefone} - ${cliente.email}`;
        
        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.addEventListener('click', () => removerCliente(index));
        
        li.appendChild(btnRemover);
        listaClientes.appendChild(li);
    });
}

function removerCliente(index) {
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    clientes.splice(index, 1); // Remove o cliente pelo índice
    localStorage.setItem('clientes', JSON.stringify(clientes));
    listarClientes(); // Atualiza a lista
}

// Chama a função para listar clientes ao carregar a página
listarClientes();