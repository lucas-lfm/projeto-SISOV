const express = require('express');
const { 
    gerarQRCode, 
    getAnimalsByProducerId, 
    getAnimalById, 
    obterAnimal,
    adicionarAnimal // Certifique-se de importar esta função
} = require('../controllers/animalController');

const autenticarToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Rota para listar todos os animais de um produtor
router.get('/:idProdutor/animais', autenticarToken, getAnimalsByProducerId);

// Rota para adicionar um novo animal ao produtor
router.post('/:idProdutor/animais', autenticarToken, adicionarAnimal);

// Rota para obter um animal específico de um produtor
router.get('/:idProdutor/animais/:idAnimal', autenticarToken, getAnimalById);

// Rota para gerar QR Code para um animal (rota protegida)
router.get('/:idProdutor/animais/:animalId/qrcode', autenticarToken, gerarQRCode); // Corrigido aqui

// Rota para buscar informações de um animal pelo ID (rota protegida)
router.get('/:animalId', autenticarToken, obterAnimal);

module.exports = router;
