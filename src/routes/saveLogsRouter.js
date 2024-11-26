// Importa os módulos necessários
const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os'); // Módulo para obter informações do sistema
const authenticateToken = require('../middware/auth.js')

const router = express.Router();

// Rota para salvar o log no sistema de arquivos
router.post('/save-log', authenticateToken, (req, res) => {
    const logData = req.body; // Dados recebidos do frontend

    // Obtém o caminho para a área de trabalho do usuário
    const desktopDir = path.join(os.homedir(), 'Desktop');

    // Define a pasta 'logs' dentro da área de trabalho
    const logsDir = path.join(desktopDir, 'logs');

    // Certifica-se de que a pasta 'logs' existe, caso contrário, cria a pasta
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    // Gera o nome do arquivo baseado na data e hora atuais
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR').replace(/\//g, '-'); // Formato DD-MM-YY
    const formattedTime = now.toTimeString().slice(0, 5).replace(/:/g, '-'); // Formato HH-MM
    const fileName = `log-rifa ${formattedDate} ${formattedTime}.txt`; // Nome do arquivo com data e hora

    // Caminho completo do arquivo onde o log será salvo
    const filePath = path.join(logsDir, fileName);

    // Salva o arquivo com os dados do log
    fs.writeFile(filePath, JSON.stringify(logData, null, 2), (err) => {
        if (err) {
            console.error('Erro ao salvar o arquivo:', err);
            return res.status(500).send('Erro ao salvar o arquivo'); // Envia erro 500 caso falhe
        }
        res.send(`Log salvo com sucesso em: ${filePath}`); // Mensagem de sucesso com o caminho do arquivo
    });
});

module.exports = router;
