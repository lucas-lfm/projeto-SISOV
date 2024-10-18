// backend/routes/userRoutes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Função para ler dados do db.json com tratamento de erros
const readData = () => {
  console.log("Lendo dados do db.json");
  const dataPath = path.join(__dirname, '../data/db.json');
  try {
    const jsonData = fs.readFileSync(dataPath, 'utf8');
    const parsedData = JSON.parse(jsonData);
    if (!parsedData || !Array.isArray(parsedData.usuarios)) {
      // Verifica se 'parsedData' é válido e se 'usuarios' é um array
      console.warn('Estrutura de dados inválida. Esperado um array de usuários.');
      return []; // Retorna um array vazio caso o formato esteja incorreto
    }
    return parsedData.usuarios;
  } catch (error) {
    console.error('Erro ao ler o arquivo db.json:', error.message);
    return []; // Retorna um array vazio em caso de erro
  }
};

// Função para escrever dados no db.json com tratamento de erros
const writeData = (data) => {
  const dataPath = path.join(__dirname, '../data/db.json');
  try {
    fs.writeFileSync(dataPath, JSON.stringify({ users: data }, null, 2));
    console.log('Dados salvos com sucesso no db.json');
  } catch (error) {
    console.error('Erro ao salvar dados no db.json:', error.message);
  }
};

// Rota para registrar usuário
router.post('/users/register', [
  body('username').notEmpty().withMessage('Nome de usuário é obrigatório.'),
  body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.')
], (req, res) => {
  // Log para verificar o corpo da requisição
  console.log('Dados recebidos:', req.body); // Adicione esta linha

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
router.post('/users/login', [
  body('username').notEmpty().withMessage('Nome de usuário é obrigatório.'),
  body('password').notEmpty().withMessage('Senha é obrigatória.')
], (req, res) => {
  // Log para verificar o corpo da requisição
  console.log('Dados de login recebidos:', req.body);

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

  // Retornar sucesso com as informações do usuário
  return res.status(200).json({ message: 'Login bem-sucedido!', userId: user.id, username: user.username });
});


// Rota para listar usuários
router.get('/users', (req, res) => {
  const users = readData();
  return res.status(200).json(users);
});

// Rota para obter as informações do usuário pelo ID
router.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const users = readData();

  // Procurar o usuário com o ID correspondente
  const user = users.find(user => user.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  return res.status(200).json(user);
});


module.exports = router;
