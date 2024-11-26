// Importa os módulos necessários
const express = require('express');
const Numbers = require('../models/Numbers');
const Buyer = require('../models/Buyer');
const authenticateToken = require('../middware/auth.js')

const router = express.Router();

// Rota para buscar todos os números
router.get('/numbers', async (req, res) => {
  try {
    const numbersList = await Numbers.findAll();
    res.json(numbersList);
  } catch (error) {
    // Caso ocorra um erro ao buscar os números
    res.status(500).json({ error: 'Erro ao buscar os números. Tente novamente mais tarde.' });
  }
});

// Rota para buscar um número específico, incluindo os dados do comprador
router.get('/numbers/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const numberData = await Numbers.findByPk(id, {
      include: {
        model: Buyer,
        as: 'buyer', // Inclui o alias correto aqui
        attributes: ['name', 'telephone'],
      },
    });

    if (!numberData) {
      return res.status(404).json({ message: 'Número não encontrado.' });
    }

    res.json(numberData);
  } catch (error) {
    console.error('Erro ao buscar número:', error.message, error.stack);
    res.status(500).json({ error: 'Erro ao buscar o número. Tente novamente mais tarde.' });
  }
});

// Rota para criar um novo número
router.post('/numbers', authenticateToken, async (req, res) => {
  try {
    const { number } = req.body;

    if (!number) {
      return res.status(400).json({ error: 'O campo "número" é obrigatório.' });
    }

    const newNumber = await Numbers.create({ number });
    res.status(201).json(newNumber); // Retorna o número criado com sucesso
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar o número. Verifique os dados enviados.' });
  }
});

// Rota para atualizar um número específico
router.put('/numbers/:id', authenticateToken, async (req, res) => {
  try {
    const { number, buyerId } = req.body;
    const id = req.params.id;

    const numbers = await Numbers.findByPk(id);

    if (!numbers) {
      return res.status(404).json({ message: 'Número não encontrado.' });
    }

    await numbers.update({ number, buyerId });
    res.status(200).json({ message: 'Número atualizado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o número. Tente novamente mais tarde.' });
  }
});

// Rota para atualizar apenas o campo buyerId de um número
router.patch('/numbers/:id', authenticateToken, async (req, res) => {
  try {
    const { buyerId } = req.body;
    const id = req.params.id;

    const numbers = await Numbers.findByPk(id);

    if (!numbers) {
      return res.status(404).json({ message: 'Número não encontrado.' });
    }

    numbers.buyerId = buyerId;
    await numbers.save();

    res.status(200).json({ message: 'buyerId atualizado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o buyerId. Tente novamente mais tarde.' });
  }
});

// Rota para setar o campo buyerId de um número como null
router.patch('/numbers-null/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    console.log('ID recebido no backend:', id); // Log para verificar o ID recebido

    const number = await Numbers.findByPk(id);

    if (!number) {
      return res.status(404).json({ message: 'Número não encontrado.' });
    }

    number.buyerId = null;
    await number.save();

    res.status(200).json({ message: 'buyerId atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao tentar atualizar buyerId:', error);
    res.status(500).json({ error: 'Erro ao atualizar o buyerId. Tente novamente mais tarde.' });
  }
});

// Rota para deletar um número específico
router.delete('/numbers/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const number = await Numbers.findByPk(id);

    if (!number) {
      return res.status(404).json({ message: 'Número não encontrado.' });
    }

    await number.destroy();
    res.status(200).json({ message: 'Número deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar o número. Tente novamente mais tarde.' });
  }
});

module.exports = router;
