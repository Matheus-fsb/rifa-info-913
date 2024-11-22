const express = require('express');
const path = require('path');

const buyerRoutes = require('./routes/buyerRoutes.js');
const numbersRoutes = require('./routes/numbersRoutes.js');
const logRoutes = require('./routes/logRoutes.js')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(buyerRoutes);
app.use(numbersRoutes);
app.use(logRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/geral/html/index.html'));
});

app.use(express.static(path.join(__dirname, '../public/geral')));
app.use(express.static(path.join(__dirname, '../public')));  


app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = app;
