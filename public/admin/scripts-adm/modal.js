// Elementos principais
const numberGridArray = document.getElementById('number-grid');
const modal_escolha = document.getElementById('modal-escolha');
const modal_cadastro_novo = document.getElementById('modal-cadastro-novo');
const modal_cadastro_existente = document.getElementById('modal-cadastro-existente');

numberGridArray.addEventListener('click', async (event) => {
    const numberId = event.target.getAttribute('data-id');
    const modalText = document.getElementById('modal-text');
    modalText.textContent = `Número selecionado: ${event.target.textContent}`;

    // Exibe o modal de escolha
    modal_escolha.classList.remove('hidden');
    document.body.classList.add('blur');

    // Botões do modal de escolha
    const cadastroNovo = document.getElementById('cadastrarNovo');
    const cadastroExistente = document.getElementById('cadastrarExistente')

    cadastroNovo.addEventListener('click', () => {
        // Alterna para o modal de cadastro novo
        modal_escolha.classList.add('hidden');
        modal_cadastro_novo.classList.remove('hidden');

        // Formulário de cadastro
        const form_completo = document.getElementById('form-completo');

        form_completo.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email-novo').value,
                telephone: document.getElementById('telephone').value,
            };

            try {
                // Envia dados para criar o comprador
                const response = await fetch('/buyers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();
                if (response.ok) {
                    console.log('Comprador registrado com sucesso:', data.buyer);

                    // Atualiza o buyerId no número
                    const buyerId = data.buyer.id;
                    const updateResponse = await fetch(`/numbers/${numberId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ buyerId }),
                    });

                    const updateData = await updateResponse.json();
                    if (updateResponse.ok) {
                        console.log(updateData.message);
                        alert(updateData.message);
                        location.reload(); // Recarrega a página
                    } else {
                        console.error(updateData.message);
                        alert(updateData.message);
                    }
                } else {
                    console.error('Erro ao registrar comprador:', data.error);
                    alert(data.error);
                }
            } catch (error) {
                console.error('Erro ao enviar os dados:', error);
                alert('Erro ao tentar registrar comprador. Tente novamente.');
            }
        });
    });

    cadastroExistente.addEventListener('click', () => {
        modal_escolha.classList.add('hidden');
        modal_cadastro_existente.classList.remove('hidden');

        const form_existente = document.getElementById('form-existente');

        form_existente.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                email: document.getElementById('email-existente').value,
            };

            try {
                // Busca o comprador pelo e-mail
                const response = await fetch(`/buyers/${formData.email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const buyerData = await response.json();

                if (response.ok) {
                    console.log('Comprador encontrado:', buyerData);

                    const buyerId = buyerData.id; // ID do comprador encontrado

                    // Atualiza o buyerId no número
                    const updateResponse = await fetch(`/numbers/${numberId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ buyerId }), // Passa o buyerId na requisição
                    });

                    const updateData = await updateResponse.json();

                    if (updateResponse.ok) {
                        console.log(updateData.message); // Exibe mensagem de sucesso
                        alert(updateData.message);
                        location.reload(); // Recarrega a página
                    } else {
                        console.error(updateData.message); // Exibe mensagem de erro
                        alert(updateData.message);
                    }
                } else {
                    console.error('Erro ao buscar comprador:', buyerData.error);
                    alert(buyerData.error);
                }
            } catch (error) {
                console.error('Erro ao buscar comprador existente:', error);
                alert('Erro ao buscar comprador. Tente novamente mais tarde.');
            }
        });

    });
});
