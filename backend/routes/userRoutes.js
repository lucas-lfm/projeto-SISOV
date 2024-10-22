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
      console.warn('Estrutura de dados inválida. Esperado um array de usuários.');
      return []; 
    }
    return parsedData.usuarios;
  } catch (error) {
    console.error('Erro ao ler o arquivo db.json:', error.message);
    return [];
  }
};

// Função para escrever dados no db.json com tratamento de erros
const writeData = (data) => {
  const dataPath = path.join(__dirname, '../data/db.json');
  try {
    fs.writeFileSync(dataPath, JSON.stringify({ usuarios: data }, null, 2));
    console.log('Dados salvos com sucesso no db.json');
  } catch (error) {
    console.error('Erro ao salvar dados no db.json:', error.message);
  }
};

// Rota para registrar usuário
router.post('/usuarios/register', [
  body('username').notEmpty().withMessage('Nome de usuário é obrigatório.'),
  body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.')
], (req, res) => {
  console.log('Dados recebidos:', req.body);

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

  const novoUsuario = { id: usuarios.length + 1, username, password, animais: [] }; // Adicione um array para os animais
  usuarios.push(novoUsuario);
  writeData(usuarios);

  return res.status(201).json({ message: 'Usuário registrado com sucesso!' });
});

// Rota para login de usuário
router.post('/usuarios/login', [
  body('username').notEmpty().withMessage('Nome de usuário é obrigatório.'),
  body('password').notEmpty().withMessage('Senha é obrigatória.')
], (req, res) => {
  console.log('Dados de login recebidos:', req.body);

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

  return res.status(200).json({ message: 'Login bem-sucedido!', userId: usuario.id, username: usuario.username });
});

// Rota para listar usuários
router.get('/usuarios', (req, res) => {
  const usuarios = readData();
  return res.status(200).json(usuarios);
});

// Rota para obter as informações do usuário pelo ID
router.get('/usuarios/:id', (req, res) => {
  const usuarioId = parseInt(req.params.id, 10);
  const usuarios = readData();

  const usuario = usuarios.find(usuario => usuario.id === usuarioId);
  if (!usuario) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  return res.status(200).json(usuario);
});

// Rota para listar todos os animais de um produtor
router.get('/usuarios/:idProdutor/animais', (req, res) => {
  const idProdutor = parseInt(req.params.idProdutor, 10);
  const usuarios = readData();

  const produtor = usuarios.find(usuario => usuario.id === idProdutor);
  if (!produtor) {
    return res.status(404).json({ mensagem: 'Produtor não encontrado' });
  }

  // Retorna todos os animais do produtor
  res.json(produtor.animais);
});

// Rota para obter um animal específico de um produtor
router.get('/usuarios/:idProdutor/animais/:idAnimal', (req, res) => {
  const idProdutor = parseInt(req.params.idProdutor, 10);
  const idAnimal = req.params.idAnimal; 
  const usuarios = readData();

  const produtor = usuarios.find(usuario => usuario.id === idProdutor);
  if (!produtor) {
    return res.status(404).json({ mensagem: 'Produtor não encontrado' });
  }

  const animal = produtor.animais.find(animal => animal.identificacao_animal === idAnimal);
  if (!animal) {
    return res.status(404).json({ mensagem: 'Animal não encontrado' });
  }

  res.json(animal);
});

// Função para obter o IP local
const os = require('os');

function getLocalIPAddress() {
    const networkInterfaces = os.networkInterfaces();
    for (let interfaceName in networkInterfaces) {
        for (let iface of networkInterfaces[interfaceName]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address; // Retorna o primeiro IP não interno encontrado
            }
        }
    }
    return 'IP não encontrado'; // Retorna uma mensagem caso nenhum IP seja encontrado
}

console.log(getLocalIPAddress()); // Exibe o IP encontrado no console


// Rota para retornar o IP local
router.get('/ip-local', (req, res) => {
  const localIp = getLocalIPAddress();
  res.send(localIp);
});

module.exports = router;
