// backend/controllers/authController.js
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const SECRET_KEY = '@cp4guvre';

// Função para ler dados do db.json
const readData = () => {
  const dataPath = path.join(__dirname, '../data/db.json');
  try {
    const jsonData = fs.readFileSync(dataPath, 'utf8');
    const parsedData = JSON.parse(jsonData);
    if (!parsedData || !Array.isArray(parsedData.usuarios)) {
      console.warn('Estrutura de dados inválida. Esperado um array de usuários.');
      return [];
    }
    return parsedData.usuarios;
  } catch (error) {
    console.error('Erro ao ler o arquivo db.json:', error.message);
    return [];
  }
};

// Função para fazer login de um usuário
const loginUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const usuarios = readData();
  const usuario = usuarios.find(usuario => usuario.username === username && usuario.password === password);
  if (!usuario) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  // Gera um token JWT para o usuário autenticado
  const token = jwt.sign({ userId: usuario.id, username: usuario.username }, SECRET_KEY, { expiresIn: '1h' });

  // Retorna o token e o userId para o frontend
  return res.status(200).json({
    message: 'Login bem-sucedido!',
    token: token,
    userId: usuario.id  // Aqui estamos retornando o userId junto com o token
  });
};

const registerUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const usuarios = readData();
  
  const usuarioExiste = usuarios.find(usuario => usuario.username === username);
  if (usuarioExiste) {
    return res.status(400).json({ message: 'Usuário já existe.' });
  }

  const novoUsuario = {
    id: usuarios.length + 1,
    username,
    password,
    animais: []
  };

  usuarios.push(novoUsuario);
  writeData(usuarios);

  // Verificando a resposta
  const response = { message: 'Usuário registrado com sucesso!' };
  console.log("Resposta do Backend:", JSON.stringify(response));  // Adiciona um log para ver a resposta
  return res.status(201).json(response);
};


// Função para escrever dados no db.json
const writeData = (data) => {
  const dataPath = path.join(__dirname, '../data/db.json');
  try {
    fs.writeFileSync(dataPath, JSON.stringify({ usuarios: data }, null, 2));
    console.log('Dados salvos com sucesso no db.json');
  } catch (error) {
    console.error('Erro ao salvar dados no db.json:', error.message);
  }
};

module.exports = {
  loginUser,
  registerUser
};
