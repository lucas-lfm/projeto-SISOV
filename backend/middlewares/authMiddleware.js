const jwt = require('jsonwebtoken');
const SECRET_KEY = '@cp4guvre';

// Middleware para verificar token JWT
function autenticarToken(req, res, next) {
    const token = req.headers['authorization'];

    // Se o token não for fornecido, redireciona para a página de login
    if (!token) {
        return res.redirect('http://192.168.1.234:8080/pages/login_user.html'); // Caminho para a página de login no frontend
    }

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, user) => {
        if (err) {
            // Retorna uma resposta de erro se o token for inválido ou expirado
            return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
        }
        req.user = user; // Dados do usuário autenticado
        next();
    });
}

module.exports = autenticarToken;
