// Importa os módulos necessários
const Admin = require('../models/Admin');
const express = require('express');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middware/auth.js')

const router = express.Router();

// Rota para listar todos os administradores
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const admin = await Admin.findAll();
    res.json(admin); // Retorna todos os administradores
  } catch (error) {
    // Caso ocorra um erro ao buscar administradores
    res.status(500).json({ error: "Erro ao buscar administradores. Tente novamente mais tarde." });
  }
});

// Rota para registrar um novo administrador
router.post('/admin', async (req, res) => {
  const { username, password } = req.body;

  // Verifica se o nome de usuário e a senha foram fornecidos
  if (!username || !password) {
    return res.status(400).json({ error: 'O nome de usuário e a senha são obrigatórios.' });
  }

  try {
    // Criptografa a senha antes de armazená-la no banco de dados
    const hashedPassword = await bcrypt.hash(password, 10); // 10 é o número de saltos (quanto mais, mais seguro)

    // Cria um novo administrador no banco de dados
    const admin = await Admin.create({ username, password: hashedPassword });

    // Retorna a resposta de sucesso com os dados do administrador
    res.status(201).json({
      message: 'Administrador registrado com sucesso.',
      admin: { id: admin.id, username: admin.username },
    });
  } catch (error) {
    console.error(error);
    // Caso ocorra um erro ao registrar o administrador
    res.status(400).json({ error: 'Erro ao registrar o administrador. Verifique os dados fornecidos.' });
  }
});

// Rota para atualizar os dados de um administrador
router.put('/admin/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { username, password } = req.body;

    // Busca o administrador pelo ID
    const admin = await Admin.findByPk(id);

    // Verifica se o administrador foi encontrado
    if (!admin) {
      return res.status(404).json({ message: 'Administrador não encontrado.' });
    }

    // Atualiza os dados do administrador
    await admin.update({ username, password });

    // Retorna a resposta de sucesso
    res.status(200).json({ message: 'Administrador atualizado com sucesso.', admin });
  } catch (error) {
    // Caso ocorra um erro ao atualizar o administrador
    res.status(500).json({ error: 'Erro ao atualizar o administrador. Tente novamente mais tarde.' });
  }
});

// Rota para deletar um administrador
router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;

    // Busca o administrador pelo ID
    const admin = await Admin.findByPk(id);

    // Verifica se o administrador foi encontrado
    if (!admin) {
      return res.status(404).json({ message: 'Administrador não encontrado.' });
    }

    // Deleta o administrador
    await admin.destroy();

    // Retorna a resposta de sucesso
    res.status(200).json({ message: 'Administrador deletado com sucesso.' });
  } catch (error) {
    // Caso ocorra um erro ao deletar o administrador
    res.status(500).json({ error: 'Erro ao deletar o administrador. Tente novamente mais tarde.' });
  }
});

// Exporta as rotas para o arquivo principal do servidor
module.exports = router;
