// Importa os módulos necessários
const express = require('express');
const Numbers = require('../models/Numbers');
const Buyer = require('../models/Buyer');
const authenticateToken = require('../middware/auth.js')

const router = express.Router();

// Rota para gerar um relatório de números e seus compradores
router.get('/log', authenticateToken, async (req, res) => {
  try {
    // Busca todos os números, incluindo informações do comprador (se houver)
    const numbers = await Numbers.findAll({
      include: {
        model: Buyer,
        as: 'buyer', // Inclui o comprador relacionado
        required: false, // Permite que números sem comprador sejam retornados
      },
    });

    // Gera o relatório, mapeando os números e seus respectivos compradores
    const report = numbers.map((number) => ({
      numberId: number.number, // ID do número
      buyer: number.buyer
        ? {
            buyerId: number.buyer.id, // ID do comprador
            buyerName: number.buyer.name, // Nome do comprador
            buyerTelephone: number.buyer.telephone, // Telefone do comprador
            buyerEmail: number.buyer.email, // E-mail do comprador
          }
        : null, // Caso não haja comprador, atribui null
    }));

    // Retorna o relatório gerado no formato JSON
    res.json(report);
  } catch (error) {
    // Caso ocorra um erro, retorna uma mensagem de erro
    console.error(error);
    res.status(500).json({ error: 'Erro ao gerar o relatório. Tente novamente mais tarde.' });
  }
});

module.exports = router;
