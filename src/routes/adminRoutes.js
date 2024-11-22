const Admin = require('../models/Admin');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/admin', async (req, res) => {
  try {
    const admin = await Admin.findAll();
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar administradores. Tente novamente mais tarde." });
  }
});

router.post('/admin/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'O nome de usuário e a senha são obrigatórios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 é o número de saltos (quanto mais, mais seguro)

    const admin = await Admin.create({ username, password: hashedPassword });

    res.status(201).json({
      message: 'Administrador registrado com sucesso.',
      admin: { id: admin.id, username: admin.username },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao registrar o administrador. Verifique os dados fornecidos.' });
  }
});

// Rota de login
router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'O nome de usuário e a senha são obrigatórios.' });
  }

  try {
    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      return res.status(401).json({ error: 'Credenciais inválidas. Verifique o nome de usuário e a senha.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas. Verifique o nome de usuário e a senha.' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username }, // Payload
      'secretkey', // Chave secreta (deve ser armazenada de forma segura)
      { expiresIn: '1h' } // Expiração do token
    );

    res.json({ message: 'Login realizado com sucesso.', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao realizar login. Tente novamente mais tarde.' });
  }
});

router.put('/admin/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { username, password } = req.body;
    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).json({ message: 'Administrador não encontrado.' });
    }

    await admin.update({ username, password });
    res.status(200).json({ message: 'Administrador atualizado com sucesso.', admin });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o administrador. Tente novamente mais tarde.' });
  }
});

router.delete('/admin/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).json({ message: 'Administrador não encontrado.' });
    }

    await admin.destroy();
    res.status(200).json({ message: 'Administrador deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar o administrador. Tente novamente mais tarde.' });
  }
});

module.exports = router;
