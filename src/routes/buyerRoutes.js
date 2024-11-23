const express = require('express');
const Buyer = require('../models/Buyer');

const router = express.Router();

router.get('/buyers', async (req, res) => {
  try {
    const buyer = await Buyer.findAll();
    res.json(buyer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar compradores. Tente novamente mais tarde.' });
  }
});

router.get('/buyers/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const buyer = await Buyer.findOne({ where: { email } });
    
    if (!buyer) {
      return res.status(404).json({ error: 'Comprador não encontrado.' });
    }
    
    res.json(buyer); 
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o comprador. Tente novamente mais tarde.' });
  }
});


router.post('/buyers', async (req, res) => {
  const { name, email, telephone } = req.body;
  try {
    const buyer = await Buyer.create({ name, email, telephone });
    res.status(201).json({
      message: 'Comprador registrado com sucesso.',
      buyer,
    });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao registrar comprador. Verifique os dados fornecidos.' });
  }
});

router.put('/buyers/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, telephone } = req.body;
    const buyer = await Buyer.findByPk(id);

    if (!buyer) {
      return res.status(404).json({ message: 'Comprador não encontrado.' });
    }

    await buyer.update({ name, email, telephone });
    res.status(200).json({
      message: 'Dados do comprador atualizados com sucesso.',
      buyer,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar comprador. Tente novamente mais tarde.' });
  }
});

router.delete('/buyers/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const buyer = await Buyer.findByPk(id);

    if (!buyer) {
      return res.status(404).json({ message: 'Comprador não encontrado.' });
    }

    await buyer.destroy();
    res.status(200).json({ message: 'Comprador removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover comprador. Tente novamente mais tarde.' });
  }
});

module.exports = router;
