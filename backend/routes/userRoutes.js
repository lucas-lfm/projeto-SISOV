// backend/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Rota para listar usuários
router.get('/', userController.getAllUsers);

// Rota para obter um usuário pelo ID
router.get('/:id', userController.getUserById);

module.exports = router;
