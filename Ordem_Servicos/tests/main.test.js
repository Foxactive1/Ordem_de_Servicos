// tests/main.test.js
import { carregarClientesRelatorio, listarProdutosPorCliente, listarServicosPorCliente, calcularTotalVendasPorCliente, listarSaidaDeProdutos, exportarRelatorioCsv, exportarRelatorioPdf } from '../src/main';

describe('Testes para as funções do módulo', () => {
    beforeEach(() => {
        // Configuração inicial, limpa o localStorage
        localStorage.clear();
        
        // Dados de teste
        localStorage.setItem('clientes', JSON.stringify([{ nome: 'Cliente A' }, { nome: 'Cliente B' }]));
        localStorage.setItem('produtos', JSON.stringify([{ nomeProduto: 'Produto 1', preco: 10 }, { nomeProduto: 'Produto 2', preco: 20 }]));
        localStorage.setItem('vendas', JSON.stringify([{ cliente: 'Cliente A', produto: 'Produto 1', quantidade: 2 }, { cliente: 'Cliente A', produto: 'Produto 2', quantidade: 1 }]));
        localStorage.setItem('ordensDeServico', JSON.stringify([{ clienteOS: 'Cliente A', descricaoOS: 'Serviço 1', statusOS: 'Concluído' }]));
    });

    test('Deve carregar clientes para relatório', () => {
        const clientes = document.getElementById('clienteRelatorio').options;
        expect(clientes.length).toBe(2);
        expect(clientes[0].text).toBe('Cliente A');
        expect(clientes[1].text).toBe('Cliente B');
    });

    test('Deve listar produtos por cliente', () => {
        listarProdutosPorCliente('Cliente A');
        const rows = document.querySelectorAll('#produtosCliente tr');
        expect(rows.length).toBe(2);
        expect(rows[0].textContent).toContain('Produto 1');
        expect(rows[1].textContent).toContain('Produto 2');
    });

    test('Deve listar serviços por cliente', () => {
        listarServicosPorCliente('Cliente A');
        const rows = document.querySelectorAll('#servicosCliente tr');
        expect(rows.length).toBe(1);
        expect(rows[0].textContent).toContain('Serviço 1');
    });

    test('Deve calcular total de vendas por cliente', () => {
        calcularTotalVendasPorCliente('Cliente A');
        const totalVendas = document.getElementById('totalVendasCliente').textContent;
        expect(totalVendas).toBe('R$ 40.00');
    });

    test('Deve listar saída de produtos', () => {
        listarSaidaDeProdutos();
        const rows = document.querySelectorAll('#saidaProdutos tr');
        expect(rows.length).toBe(2);
        expect(rows[0].textContent).toContain('Produto 1');
        expect(rows[1].textContent).toContain('Produto 2');
    });

    // Os testes para exportarCSV e exportarPDF podem ser mais complexos e podem exigir a simulação de cliques ou a inspeção de arquivos gerados.
});

