const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const animalRoutes = require('./routes/animalRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos (exemplo: index.html e outros recursos do frontend)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Redirecionar para a porta 3000
app.get('/', (req, res) => {
    res.redirect('http://sisov.local:8080');
});

// Definindo as rotas de API
app.use('/api/auth', authRoutes);   // Rota de autenticação
app.use('/api/usuarios', userRoutes);  // Rota de usuários
app.use('/api/animais', animalRoutes);   // Rota de animais

// Servir QR Codes gerados
app.use('/qrcodes', express.static(path.join(__dirname, './qrcodes')));

// Iniciar o servidor na porta 80
const PORT = 8080; // Alterado para 80 para que o redirecionamento funcione sem precisar de porta
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor rodando na porta ${PORT}`));
