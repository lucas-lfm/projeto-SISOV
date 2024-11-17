const express = require('express');
const userRoutes = require('./userRoutes'); // Importando as rotas de usuário
const animalRoutes = require('./animalRoutes'); // Importando as rotas de animais
const authRoutes = require('./authRoutes'); // Importando as rotas de autenticação

const router = express.Router();

// Registrar as rotas com seus respectivos prefixos
router.use('/usuarios', userRoutes);
router.use('/animais', animalRoutes);
router.use('/auth', authRoutes);

module.exports = router;
