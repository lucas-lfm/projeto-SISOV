// userController.js

// Função para lidar com o registro de usuário
const registerUser = (req, res) => {
    const { newUsername, newPassword } = req.body;
  
    if (!newUsername || !newPassword) {
      return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
    }
  
    // Aqui é onde a lógica de salvar no banco de dados ou JSON vai ser implementada
    console.log(`Cadastro de usuário: ${newUsername}`);
  
    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  };
  
  module.exports = {
    registerUser,
  };
  