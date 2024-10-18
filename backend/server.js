// backend/server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Importando as rotas de usuário

const app = express();

// Middleware
app.use(bodyParser.json()); // Para entender JSON no corpo das requisições
app.use(express.static(path.join(__dirname, '../frontend/public'))); // Servir arquivos estáticos do frontend

// Rota para servir o arquivo 'index.html'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// Usando as rotas de usuário com prefixo '/api'
app.use('/api', userRoutes);

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});