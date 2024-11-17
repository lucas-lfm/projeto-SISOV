// backend/routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Rota para login de usuário
router.post('/login', [
  body('username').notEmpty().withMessage('Nome de usuário é obrigatório.'),
  body('password').notEmpty().withMessage('Senha é obrigatória.')
], authController.loginUser);

// Rota para registro de usuário
router.post('/register', [
  body('username').notEmpty().withMessage('Nome de usuário é obrigatório.'),
  body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.')
], authController.registerUser);

module.exports = router;
