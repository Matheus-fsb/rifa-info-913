const express = require('express');
const path = require('path');
const cors = require('cors');

const numbersRoutes = require('./routes/numbersRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const buyerRoutes = require('./routes/buyerRoutes.js');
const logRoutes = require('./routes/logRoutes.js');

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use(numbersRoutes);
app.use(buyerRoutes);
// app.use(adminRoutes);
app.use(logRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/geral/html/index.html'));
});

// Rota admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/html/index.html'));
});

// Arquivos estáticos
app.use(express.static(path.join(__dirname, '../public/geral')));
app.use(express.static(path.join(__dirname, '../public/admin')));
app.use(express.static(path.join(__dirname, '../public')));

// Rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Rota não encontrada',
  });
});

module.exports = app;
