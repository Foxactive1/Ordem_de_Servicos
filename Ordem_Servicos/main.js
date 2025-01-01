const { lerArquivo, escreverArquivo } = require('./files');

export async function carregarClientesRelatorio() {
    try {
        const clientes = await lerArquivo('clientes.json');
        const select = document.getElementById('clienteRelatorio');
        select.innerHTML = '<option value="">Selecione um cliente</option>'; // Reseta as opções

        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.nome;
            option.textContent = cliente.nome;
            select.appendChild(option);
        });
    } catch (err) {
        console.error('Erro ao carregar clientes:', err);
    }
}

export async function listarProdutosPorCliente(clienteNome) {
    try {
        const produtos = await lerArquivo('produtos.json');
        const vendas = await lerArquivo('vendas.json');
        const tabela = document.getElementById('produtosCliente');
        tabela.innerHTML = ''; // Reseta a tabela

        const produtosPorCliente = produtos.filter(produto =>
            vendas.some(venda => venda.cliente === clienteNome && venda.produto === produto.nomeProduto)
        );

        produtosPorCliente.forEach(produto => {
            const row = tabela.insertRow();
            const cellNome = row.insertCell(0);
            const cellPreco = row.insertCell(1);
            cellNome.textContent = produto.nomeProduto;
            cellPreco.textContent = `R$ ${produto.preco.toFixed(2)}`;
        });
    } catch (err) {
        console.error('Erro ao listar produtos por cliente:', err);
    }
}

// Atualize as outras funções da mesma forma, usando lerArquivo e escreverArquivo

export async function exportarRelatorioCsv() {
    try {
        const clientes = await lerArquivo('clientes.json');
        const produtos = await lerArquivo('produtos.json');
        const vendas = await lerArquivo('vendas.json');

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Clientes\n";
        clientes.forEach(cliente => {
            csvContent += `${cliente.nome}\n`;
        });

        csvContent += "\nProdutos\n";
        produtos.forEach(produto => {
            csvContent += `${produto.nomeProduto},R$ ${produto.preco.toFixed(2)}\n`;
        });

        csvContent += "\nVendas\n";
        vendas.forEach(venda => {
            csvContent += `${venda.cliente},${venda.produto},${venda.quantidade}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'relatorio.csv');
        document.body.appendChild(link);
        link.click();
    } catch (err) {
        console.error('Erro ao exportar CSV:', err);
    }
}

export async function exportarRelatorioPdf() {
    const jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF();

    try {
        const clientes = await lerArquivo('clientes.json');
        const produtos = await lerArquivo('produtos.json');
        const vendas = await lerArquivo('vendas.json');

        doc.text('Relatório de Clientes', 10, 10);
        clientes.forEach((cliente, index) => {
            doc.text(`${index + 1}. ${cliente.nome}`, 10, 20 + (index * 10));
        });

        doc.text('Relatório de Produtos', 10, 50);
        produtos.forEach((produto, index) => {
            doc.text(`${index + 1}. ${produto.nomeProduto} - R$ ${produto.preco.toFixed(2)}`, 10, 60 + (index * 10));
        });

        doc.text('Relatório de Vendas', 10, 90);
        vendas.forEach((venda, index) => {
            doc.text(`${index + 1}. Cliente: ${venda.cliente}, Produto: ${venda.produto}, Quantidade: ${venda.quantidade}`, 10, 100 + (index * 10));
        });

        doc.save('relatorio.pdf');
    } catch (err) {
        console.error('Erro ao exportar PDF:', err);
    }
}
