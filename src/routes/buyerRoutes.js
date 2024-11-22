const express = require('express');
const Buyer = require('../models/Buyer');

const router = express.Router();

router.get('/buyers', async (req, res) => {
  const buyer = await Buyer.findAll();
  try {
    res.json(buyer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar comprador' });
  }
});

router.post('/buyers', async (req, res) => {
  const { name, email, telephone } = req.body;
  try {
    const buyer = await Buyer.create({ name, email, telephone });
    res.status(201).json(buyer);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar comprador' });
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
    res.status(200).json(buyer);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(200).json({ message: 'Comprador deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
