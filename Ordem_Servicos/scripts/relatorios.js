document.addEventListener('DOMContentLoaded', function () {
    carregarClientesRelatorio();

    document.getElementById('relatorioForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const clienteNome = document.getElementById('clienteRelatorio').value;
        listarProdutosPorCliente(clienteNome);
        listarServicosPorCliente(clienteNome);
        calcularTotalVendasPorCliente(clienteNome);
        listarSaidaDeProdutos();
    });

    document.getElementById('exportarCsv').addEventListener('click', exportarRelatorioCsv);
    document.getElementById('exportarPdf').addEventListener('click', exportarRelatorioPdf);
});

function carregarClientesRelatorio() {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const clienteSelectRelatorio = document.getElementById('clienteRelatorio');

    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.nome;
        option.textContent = cliente.nome;
        clienteSelectRelatorio.appendChild(option);
    });
}

function listarProdutosPorCliente(clienteNome) {
    const produtosCliente = document.getElementById('produtosCliente');
    const totalProdutosCliente = document.getElementById('totalProdutosCliente');
    produtosCliente.innerHTML = ''; // Limpa a lista

    const vendas = JSON.parse(localStorage.getItem('vendas')) || [];
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produtosFiltrados = vendas.filter(venda => venda.cliente === clienteNome);

    let total = 0;

    produtosFiltrados.forEach(venda => {
        const produto = produtos.find(p => p.nomeProduto === venda.produto);
        if (produto) {
            const subtotal = produto.preco * venda.quantidade;
            total += subtotal;
            produtosCliente.innerHTML += `
                <tr>
                    <td>${venda.produto}</td>
                    <td>${venda.quantidade}</td>
                    <td>R$ ${subtotal.toFixed(2)}</td>
                </tr>`;
        }
    });

    totalProdutosCliente.textContent = `R$ ${total.toFixed(2)}`;

    if (produtosFiltrados.length === 0) {
        produtosCliente.innerHTML = '<tr><td colspan="3">Nenhum produto comprado por este cliente.</td></tr>';
    }
}

function listarServicosPorCliente(clienteNome) {
    const servicosCliente = document.getElementById('servicosCliente');
    servicosCliente.innerHTML = ''; // Limpa a lista

    const ordensDeServico = JSON.parse(localStorage.getItem('ordensDeServico')) || [];
    const servicosFiltrados = ordensDeServico.filter(os => os.clienteOS === clienteNome);

    servicosFiltrados.forEach(os => {
        servicosCliente.innerHTML += `
            <tr>
                <td>${os.descricaoOS}</td>
                <td>${os.statusOS}</td>
            </tr>`;
    });

    if (servicosFiltrados.length === 0) {
        servicosCliente.innerHTML = '<tr><td colspan="2">Nenhum serviço prestado a este cliente.</td></tr>';
    }
}

function calcularTotalVendasPorCliente(clienteNome) {
    const totalVendasCliente = document.getElementById('totalVendasCliente');
    const vendas = JSON.parse(localStorage.getItem('vendas')) || [];
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    let total = 0;

    vendas.forEach(venda => {
        if (venda.cliente === clienteNome) {
            const produto = produtos.find(p => p.nomeProduto === venda.produto);
            if (produto) {
                total += produto.preco * venda.quantidade;
            }
        }
    });

    totalVendasCliente.textContent = `R$ ${total.toFixed(2)}`;

    if (total === 0) {
        totalVendasCliente.textContent = 'Nenhuma venda realizada para este cliente.';
    }
}

function listarSaidaDeProdutos() {
    const saidaProdutos = document.getElementById('saidaProdutos');
    saidaProdutos.innerHTML = ''; // Limpa a lista

    const vendas = JSON.parse(localStorage.getItem('vendas')) || [];
    const produtosMap = new Map();

    vendas.forEach(venda => {
        produtosMap.set(venda.produto, (produtosMap.get(venda.produto) || 0) + parseInt(venda.quantidade));
    });

    produtosMap.forEach((quantidade, produto) => {
        saidaProdutos.innerHTML += `
            <tr>
                <td>${produto}</td>
                <td>${quantidade}</td>
            </tr>`;
    });

    if (produtosMap.size === 0) {
        saidaProdutos.innerHTML = '<tr><td colspan="2">Nenhuma venda realizada.</td></tr>';
    }
}

function exportarRelatorioCsv() {
    const clienteNome = document.getElementById('clienteRelatorio').value;
    const vendas = JSON.parse(localStorage.getItem('vendas')) || [];
    const ordensDeServico = JSON.parse(localStorage.getItem('ordensDeServico')) || [];
    
    const produtosFiltrados = vendas.filter(venda => venda.cliente === clienteNome);
    const servicosFiltrados = ordensDeServico.filter(os => os.clienteOS === clienteNome);

    let csvContent = "data:text/csv;charset=utf-8,";

    // Cabeçalhos
    csvContent += "Produto,Quantidade,Subtotal (R$)\n";
    produtosFiltrados.forEach(venda => {
        const produto = JSON.parse(localStorage.getItem('produtos')).find(p => p.nomeProduto === venda.produto);
        if (produto) {
            const subtotal = produto.preco * venda.quantidade;
            csvContent += `${venda.produto},${venda.quantidade},R$ ${subtotal.toFixed(2)}\n`;
        }
    });

    csvContent += "\nServiço,Status\n";
    servicosFiltrados.forEach(os => {
        csvContent += `${os.descricaoOS},${os.statusOS}\n`;
    });

    csvContent += `\nTotal de Vendas,R$ ${document.getElementById('totalVendasCliente').textContent}\n`;

    // Criar um link para download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_${clienteNome}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportarRelatorioPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const clienteNome = document.getElementById('clienteRelatorio').value;

    doc.setFontSize(18);
    doc.text(`Relatório de ${clienteNome}`, 14, 22);

    doc.setFontSize(12);
    doc.text('Produtos Comprados:', 14, 30);
    doc.autoTable({
        html: '#produtosClienteTable',
        startY: 35,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] }
    });

    doc.text('Serviços Prestados:', 14, doc.lastAutoTable.finalY + 10);
    doc.autoTable({
        html: '#servicosClienteTable',
        startY: doc.lastAutoTable.finalY + 15,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] }
    });

    doc.text('Total de Vendas:', 14, doc.lastAutoTable.finalY + 10);
    doc.text(document.getElementById('totalVendasCliente').textContent, 14, doc.lastAutoTable.finalY + 20);

    doc.text('Saída Total de Produtos:', 14, doc.lastAutoTable.finalY + 30);
    doc.autoTable({
        html: '#saidaProdutosTable',
        startY: doc.lastAutoTable.finalY + 35,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] }
    });

    doc.save(`relatorio_${clienteNome}.pdf`);
}