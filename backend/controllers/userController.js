// backend/controllers/userController.js
const fs = require('fs');
const path = require('path');

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

// Função para listar todos os usuários
const getAllUsers = (req, res) => {
  const usuarios = readData();
  return res.status(200).json(usuarios);
};

// Função para obter as informações de um usuário pelo ID
const getUserById = (req, res) => {
  const usuarioId = parseInt(req.params.id, 10);
  const usuarios = readData();

  const usuario = usuarios.find(usuario => usuario.id === usuarioId);
  if (!usuario) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  return res.status(200).json(usuario);
};

module.exports = {
  getAllUsers,
  getUserById
};
