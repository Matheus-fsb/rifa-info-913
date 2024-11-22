const numberGridArray = document.getElementById('number-grid');
const closeModal = document.getElementById('close-modal');
const modal = document.getElementById('number-modal');

// Adiciona um event listener ao contêiner de números
numberGridArray.addEventListener('click', async (event) => {
    if (event.target.classList.contains('number')) {

        const modalText = document.getElementById('modal-text');
        const modalName = document.getElementById('modal-name');
        const modalTel = document.getElementById('modal-tel');

        const numberId = event.target.getAttribute('data-id'); // Obtém o ID do número clicado

        modalText.textContent = `Número selecionado: ${event.target.textContent}`;

        modal.classList.remove('hidden');
        document.body.classList.add('blur');
        
        try {
            const response = await fetch(`http://localhost:3000/numbers/${numberId}`);
            const data = await response.json();

            if (response.ok) {
                // Atualiza o modal com os dados do comprador
                if (data.buyer) {
                    modalName.textContent = data.buyer.name;
                    modalTel.textContent = `****${data.buyer.telephone.slice(-4)}`; // Exibe o telefone mascarado
                } else {
                    modalName.textContent = 'Não disponível';
                    modalTel.textContent = 'Não disponível';
                }
            } else {
                modalName.textContent = 'Erro';
                modalTel.textContent = 'Erro';
            }

        } catch (error) {
            console.error('Erro ao buscar os dados do número:', error);
            modalName.textContent = 'Erro ao buscar dados';
            modalTel.textContent = 'Erro ao buscar dados';
        }
    }
});

// Fecha o modal ao clicar no botão de fechar
closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
    document.body.classList.remove('blur');
});

// Fecha o modal ao clicar fora do conteúdo
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.remove('hidden');
        document.body.classList.remove('blur');
    }
});
