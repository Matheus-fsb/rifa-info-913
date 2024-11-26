// Importa os módulos necessários
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const router = express.Router();

// Rota para o login do administrador
router.post('/login', async (req, res) => {
    try {
        const { password, username } = req.body;

        // Busca o administrador pelo nome de usuário
        const admin = await Admin.findOne({
            where: { username },
        });

        if (admin) {
            // Compara a senha fornecida com a senha armazenada (criptografada)
            const isPasswordValid = await bcrypt.compare(password, admin.password);

            if (isPasswordValid) {
                // Se a senha for válida, gera um token JWT
                const token = jwt.sign({
                    id: admin.id,
                    username: admin.username,
                }, process.env.JWT_TOKEN, { expiresIn: '30m' });

                // Retorna os dados do administrador e o token
                res.status(200).json({
                    admin: {
                        id: admin.id,
                        username: admin.username,
                    },
                    token: token,
                });
            } else {
                // Se a senha não for válida
                res.status(401).json({ error: 'Usuário e senha não coincidem.' });
            }
        } else {
            // Se o administrador não for encontrado
            res.status(401).json({ error: 'Usuário e senha não coincidem.' });
        }
    } catch (error) {
        console.error(error);
        // Caso ocorra um erro no processo de login
        res.status(500).json({ error: 'Erro ao processar a solicitação. Tente novamente mais tarde.' });
    }
});

module.exports = router;
