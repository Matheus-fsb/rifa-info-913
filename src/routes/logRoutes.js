const express = require('express');
const Numbers = require('../models/Numbers');
const Buyer = require('../models/Buyer');

const router = express.Router();

router.get('/log', async (req, res) => {
  try {
    const numbers = await Numbers.findAll({
      include: {
        model: Buyer,
        as: 'buyer',
        required: false,
      },
    });

    const report = numbers.map((number) => ({
      numberId: number.number,
      buyer: number.buyer
        ? {
            buyerId: number.buyer.id,
            buyerName: number.buyer.name,
            buyerTelephone: number.buyer.telephone,
            buyerEmail: number.buyer.email,
          }
        : null,
    }));

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao gerar o relatório. Tente novamente mais tarde.' });
  }
});

module.exports = router;
