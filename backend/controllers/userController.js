// userController.js

// Função para lidar com o registro de usuário
const registerUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
  }

  // Aqui é onde a lógica de salvar no banco de dados ou JSON vai ser implementada
  console.log(`Cadastro de usuário: ${username}`);

  return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
};

module.exports = {
  registerUser,
};
