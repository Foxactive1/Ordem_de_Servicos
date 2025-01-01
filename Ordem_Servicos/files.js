const fs = require('fs');
const path = require('path');

// Caminho para o diretório de arquivos
const directoryPath = './storage/emulated/0/Dcoder/sistema_os/Ordem_Servicos';

// Função para ler um arquivo JSON
function lerArquivo(nomeArquivo) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(directoryPath, nomeArquivo), 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
}

// Função para escrever um arquivo JSON
function escreverArquivo(nomeArquivo, conteudo) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(directoryPath, nomeArquivo), JSON.stringify(conteudo, null, 2), 'utf8', (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

// Exporta as funções
module.exports = {
    lerArquivo,
    escreverArquivo
};

