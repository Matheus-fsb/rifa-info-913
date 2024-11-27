import { createAuthHeaders } from './createHeader.js';

const computer = document.getElementById('pc');

computer.addEventListener('click', async (event) => {
    try {
        // Faz a requisição para obter o log do backend
        const response = await fetch('http://localhost:3000/log', {
            method: 'GET',
            headers: createAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Erro ao obter o log do servidor');
        }

        const log = await response.json();

        // Envia o log para o endpoint que salva o arquivo
        const saveResponse = await fetch('http://localhost:3000/save-log', {
            method: 'POST',
            headers: createAuthHeaders(),
            body: JSON.stringify(log),
        });

        if (saveResponse.ok) {
            alert('Log salvo com sucesso!');
        } else {
            alert('Erro ao salvar o log');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao processar o log');
    }
});
