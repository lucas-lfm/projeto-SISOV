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

// Rota para servir o arquivo 'index.html' na raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// Definindo as rotas de API
app.use('/api/auth', authRoutes);   // Rota de autenticação
app.use('/api/usuarios', userRoutes);  // Rota de usuários
app.use('/api/animais', animalRoutes);   // Rota de animais

// Servir QR Codes gerados
app.use('/qrcodes', express.static(path.join(__dirname, './qrcodes')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor rodando na porta ${PORT}`));
