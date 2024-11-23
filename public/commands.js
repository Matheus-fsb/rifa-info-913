async function deleteNumbers(quantity) {
    try {
        // Primeira parte: buscar o maior número no banco
        const responseMax = await fetch('/numbers');
        const numbers = await responseMax.json();

        if (numbers.length === 0) {
            alert('Não há números para deletar.');
            return;
        }

        // Encontrar o maior número (último número inserido)
        const maxNumber = Math.max(...numbers.map(number => number.number));

        // Deletar os números do maior para o menor, até quantity
        for (let i = maxNumber; i > maxNumber - quantity; i--) {
            const deleteResponse = await fetch(`/numbers/${i}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await deleteResponse.json();

            if (deleteResponse.status === 200) {
                console.log(`Número ${i} deletado com sucesso.`);
            } else {
                console.error(`Erro ao deletar o número ${i}:`, data.error || data.message);
            }
        }

        alert(`${quantity} números foram deletados com sucesso.`);
    } catch (error) {
        console.error('Erro ao tentar deletar os números:', error);
        alert('Erro ao tentar deletar os números. Tente novamente mais tarde.');
    }
}

async function createNumbers(quantity) {
    try {
      const numbers = [];
      
      // Gerar os números para a criação
      for (let i = 1; i <= quantity; i++) {
        numbers.push({ number: i }); // Aqui você pode alterar a lógica se precisar de números diferentes
      }
  
      // Enviar os números para o backend
      for (let i = 0; i < numbers.length; i++) {
        const response = await fetch('/numbers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(numbers[i]),
        });
  
        const data = await response.json();
        
        if (response.status === 201) {
          console.log(`Número ${numbers[i].number} criado com sucesso.`);
        } else {
          console.error(`Erro ao criar o número ${numbers[i].number}:`, data.error);
        }
      }
  
      alert(`${quantity} números foram criados com sucesso.`);
    } catch (error) {
      console.error('Erro ao criar os números:', error);
      alert('Erro ao tentar criar os números. Tente novamente mais tarde.');
    }
  }
  
