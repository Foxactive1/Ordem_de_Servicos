document.getElementById('osForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const clienteOS = document.getElementById('clienteOS').value;
    const descricaoOS = document.getElementById('descricaoOS').value;
    const statusOS = document.getElementById('statusOS').value;
    
    const os = { clienteOS, descricaoOS, statusOS };
    
    let ordensDeServico = JSON.parse(localStorage.getItem('ordensDeServico')) || [];
    ordensDeServico.push(os);
    localStorage.setItem('ordensDeServico', JSON.stringify(ordensDeServico));
    
    listarOS();
    this.reset();
});

function listarOS() {
    const listaOS = document.getElementById('listaOS');
    listaOS.innerHTML = ''; // Limpa a lista para evitar duplicação

    let ordensDeServico = JSON.parse(localStorage.getItem('ordensDeServico')) || [];

    ordensDeServico.forEach((os, index) => {
        const li = document.createElement('li');
        li.textContent = `Cliente: ${os.clienteOS}, Serviço: ${os.descricaoOS}, Status: ${os.statusOS}`;
        
        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.addEventListener('click', () => removerOS(index));
        
        li.appendChild(btnRemover);
        listaOS.appendChild(li);
    });
}

function removerOS(index) {
    let ordensDeServico = JSON.parse(localStorage.getItem('ordensDeServico')) || [];
    ordensDeServico.splice(index, 1); // Remove a OS pelo índice
    localStorage.setItem('ordensDeServico', JSON.stringify(ordensDeServico));
    listarOS(); // Atualiza a lista
}

function carregarClientes() {
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const clienteSelectOS = document.getElementById('clienteOS');
    
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.nome;
        option.textContent = cliente.nome;
        clienteSelectOS.appendChild(option);
    });
}

// Chama a função para listar OS e carregar clientes ao carregar a página
listarOS();
carregarClientes();

