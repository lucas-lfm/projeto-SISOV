const jwt = require('jsonwebtoken');
const SECRET_KEY = '@cp4guvre';

// Middleware para verificar token JWT
function autenticarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ mensagem: 'Token de autenticação não fornecido.' });
    }

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
        }
        req.user = user; // Dados do usuário autenticado
        next();
    });
}


module.exports = autenticarToken;
