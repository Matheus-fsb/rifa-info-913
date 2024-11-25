const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os'); // Módulo para obter informações do sistema

const router = express.Router();

router.post('/save-log', (req, res) => {
    const logData = req.body; // Dados recebidos do frontend

    // Obtém o caminho para a área de trabalho do usuário
    const desktopDir = path.join(os.homedir(), 'Desktop');

    // Define a pasta 'logs' dentro da área de trabalho
    const logsDir = path.join(desktopDir, 'logs');

    // Certifique-se de que a pasta existe
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    // Gera o nome do arquivo baseado na data e hora atuais
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR').replace(/\//g, '-'); // Formato DD-MM-YY
    const formattedTime = now.toTimeString().slice(0, 5).replace(/:/g, '-'); // Formato HH-MM
    const fileName = `log-rifa ${formattedDate} ${formattedTime}.txt`;

    // Caminho completo do arquivo
    const filePath = path.join(logsDir, fileName);

    // Salva o arquivo com o log
    fs.writeFile(filePath, JSON.stringify(logData, null, 2), (err) => {
        if (err) {
            console.error('Erro ao salvar o arquivo:', err);
            return res.status(500).send('Erro ao salvar o arquivo');
        }
        res.send(`Log salvo com sucesso em: ${filePath}`);
    });
});

module.exports = router;
