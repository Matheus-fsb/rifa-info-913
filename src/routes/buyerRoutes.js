// Importa o módulo necessário
const express = require('express');
const Buyer = require('../models/Buyer');
const authenticateToken = require('../middware/auth.js')

const router = express.Router();

// Rota para buscar todos os compradores
router.get('/buyers', authenticateToken, async (req, res) => {
  try {
    // Busca todos os compradores registrados na base de dados
    const buyers = await Buyer.findAll();
    res.json(buyers); // Retorna os compradores no formato JSON
  } catch (error) {
    // Caso ocorra um erro ao buscar os compradores
    res.status(500).json({ error: 'Erro ao buscar compradores. Tente novamente mais tarde.' });
  }
});

// Rota para buscar um comprador específico pelo e-mail
router.get('/buyers/:email', authenticateToken, async (req, res) => {
  try {
    const { email } = req.params;
    // Busca um comprador pelo e-mail
    const buyer = await Buyer.findOne({ where: { email } });

    if (!buyer) {
      // Retorna um erro 404 caso o comprador não seja encontrado
      return res.status(404).json({ error: 'Comprador não encontrado.' });
    }

    res.json(buyer); // Retorna os dados do comprador encontrado
  } catch (error) {
    // Caso ocorra um erro ao buscar o comprador
    res.status(500).json({ error: 'Erro ao buscar o comprador. Tente novamente mais tarde.' });
  }
});

// Rota para registrar um novo comprador
router.post('/buyers', authenticateToken, async (req, res) => {
  const { name, email, telephone } = req.body;
  try {
    // Cria um novo comprador na base de dados
    const buyer = await Buyer.create({ name, email, telephone });

    res.status(201).json({
      message: 'Comprador registrado com sucesso.',
      buyer, // Retorna os dados do comprador recém-criado
    });
  } catch (error) {
    // Caso ocorra um erro ao registrar o comprador
    res.status(400).json({ error: 'Erro ao registrar comprador. Verifique os dados fornecidos.' });
  }
});

// Rota para atualizar os dados de um comprador
router.put('/buyers/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, telephone } = req.body;
    // Busca o comprador pelo ID
    const buyer = await Buyer.findByPk(id);

    if (!buyer) {
      // Retorna um erro 404 caso o comprador não seja encontrado
      return res.status(404).json({ message: 'Comprador não encontrado.' });
    }

    // Atualiza os dados do comprador
    await buyer.update({ name, email, telephone });
    res.status(200).json({
      message: 'Dados do comprador atualizados com sucesso.',
      buyer, // Retorna os dados atualizados do comprador
    });
  } catch (error) {
    // Caso ocorra um erro ao atualizar os dados
    res.status(500).json({ error: 'Erro ao atualizar comprador. Tente novamente mais tarde.' });
  }
});

// Rota para remover um comprador
router.delete('/buyers/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    // Busca o comprador pelo ID
    const buyer = await Buyer.findByPk(id);

    if (!buyer) {
      // Retorna um erro 404 caso o comprador não seja encontrado
      return res.status(404).json({ message: 'Comprador não encontrado.' });
    }

    // Deleta o comprador da base de dados
    await buyer.destroy();
    res.status(200).json({ message: 'Comprador removido com sucesso.' });
  } catch (error) {
    // Caso ocorra um erro ao remover o comprador
    res.status(500).json({ error: 'Erro ao remover comprador. Tente novamente mais tarde.' });
  }
});

module.exports = router;
