const express = require('express');
const Numbers = require('../models/Numbers');
const Buyer = require('../models/Buyer')

const router = express.Router();

router.get('/numbers', async (req, res) => {
  try {
    const numbersList = await Numbers.findAll();
    res.json(numbersList);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os números' });
  }
});

router.get('/numbers/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const numberData = await Numbers.findByPk(id, {
      include: {
        model: Buyer,
        as: 'buyer', // Inclua o alias correto aqui
        attributes: ['name', 'telephone'],
      },
    });

    if (!numberData) {
      return res.status(404).json({ message: 'Número não encontrado.' });
    }

    res.json(numberData);
  } catch (error) {
    console.error('Erro ao buscar número:', error.message, error.stack);
    res.status(500).json({ error: 'Erro ao buscar o número.' });
  }
});


router.post('/numbers', async (req, res) => {
  try {
    const { number } = req.body;
    if (!number) {
      return res.status(400).json({ error: 'Número é obrigatório' });
    }
    const newNumber = await Numbers.create({ number });
    res.status(201).json(newNumber);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar o número' });
  }
});

router.put('/numbers/:id', async (req, res) => {
  try {
    const { number, buyerId } = req.body;
    const id = req.params.id;
    const numbers = await Numbers.findByPk(id);
    if (numbers) {
      await numbers.update({ number, buyerId });
      res.status(200).json({ message: 'Number updated successfully.' });
    } else {
      res.status(404).json({ message: "Number not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/numbers/:id', async (req, res) => {
  try {
    const { buyerId } = req.body;
    const id = req.params.id;

    const numbers = await Numbers.findByPk(id);

    if (!numbers) {
      return res.status(404).json({ message: "Number not found." });
    }

    if (numbers.buyerId !== null) {
      return res.status(400).json({ message: "buyerId is already set and cannot be changed." });
    }

    numbers.buyerId = buyerId;
    await numbers.save();

    res.status(200).json({ message: 'buyerId updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/numbers/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const number = await Numbers.findByPk(id);
    if (!number) {
      return res.status(404).json({ message: 'Número não encontrado.' });
    }
    await number.destroy();
    res.status(200).json({ message: 'Número deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
