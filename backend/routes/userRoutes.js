// backend/routes/userRoutes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Função para ler dados do db.json
const readData = () => {
  const dataPath = path.join(__dirname, '../config/db.json');
  const jsonData = fs.readFileSync(dataPath);
  return JSON.parse(jsonData).users; // Acesso direto à lista de usuários
};

// Função para escrever dados no db.json
const writeData = (data) => {
  const dataPath = path.join(__dirname, '../config/db.json');
  fs.writeFileSync(dataPath, JSON.stringify({ users: data }, null, 2)); // Formato correto para escrever
};

// Rota para registrar usuário
router.post('/register', [
  body('username').notEmpty().withMessage('Nome de usuário é obrigatório.'),
  body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.')
], (req, res) => {
  // Verificar erros de validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  // Ler dados existentes
  const users = readData();

  // Verificar se o usuário já existe
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'Usuário já existe.' });
  }

  // Adicionar novo usuário
  const newUser = { id: users.length + 1, username, password }; // Adicionar um ID único
  users.push(newUser);
  writeData(users);

  return res.status(201).json({ message: 'Usuário registrado com sucesso!' });
});

// Rota para login de usuário
router.post('/login', [
  body('username').notEmpty().withMessage('Nome de usuário é obrigatório.'),
  body('password').notEmpty().withMessage('Senha é obrigatória.')
], (req, res) => {
  // Verificar erros de validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  // Ler dados existentes
  const users = readData();

  // Verificar credenciais
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  return res.status(200).json({ message: 'Login bem-sucedido!' });
});

// Rota para listar usuários
router.get('/users', (req, res) => {
  const users = readData();
  return res.status(200).json(users);
});

module.exports = router;
