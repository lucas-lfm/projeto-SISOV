const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

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

// Função para listar todos os animais de um produtor
const getAnimalsByProducerId = (req, res) => {
  const idProdutor = parseInt(req.params.idProdutor, 10);
  const usuarios = readData();

  const produtor = usuarios.find(usuario => usuario.id === idProdutor);
  if (!produtor) {
    return res.status(404).json({ mensagem: 'Produtor não encontrado' });
  }

  res.json(produtor.animais);
};

// Função para obter um animal específico de um produtor
const getAnimalById = (req, res) => {
  const idProdutor = parseInt(req.params.idProdutor, 10);
  const idAnimal = req.params.idAnimal;
  const usuarios = readData();

  console.log('ID do Produtor:', idProdutor);
  console.log('ID do Animal:', idAnimal);

  const produtor = usuarios.find(usuario => usuario.id === idProdutor);
  if (!produtor) {
    console.log('Produtor não encontrado');
    return res.status(404).json({ mensagem: 'Produtor não encontrado' });
  }

  const animal = produtor.animais.find(animal => animal.identificacao_animal === idAnimal);
  if (!animal) {
    console.log('Animal não encontrado');
    return res.status(404).json({ mensagem: 'Animal não encontrado' });
  }

  res.json(animal);
};


// Função para gerar QRCode para um animal
const gerarQRCode = async (req, res) => {
  const { animalId } = req.params; // animalId é o ID numérico do animal
  const usuarios = readData(); // Lê os dados do db.json

  // Encontra o animal pelo identificador dentro de 'animais' de cada usuario
  const animal = usuarios.flatMap(u => u.animais).find(a => a.identificacao_animal === animalId);

  if (!animal) {
    return res.status(404).json({ mensagem: 'Animal não encontrado' });
  }

  // Encontra o produtor que possui esse animal
  const produtor = usuarios.find(u => u.animais.some(a => a.identificacao_animal === animalId));

  if (!produtor) {
    return res.status(400).json({ mensagem: 'Produtor ID não encontrado para o animal' });
  }

  // Agora temos o produtor e o animal, então podemos acessar o 'produtorId' corretamente
  const produtorId = produtor.id; // O ID do produtor está no objeto 'produtor'

  console.log('Animal encontrado:', animal);
  console.log('Produtor ID encontrado:', produtorId); // Verificando o ID do produtor

  // Construir a URL para o painel do animal
  const urlAnimal = `http://192.168.1.234:8080/api/animais/${produtorId}/animais/${animal.identificacao_animal}`;

  try {
    // Gerar o QRCode em formato Base64
    const qrCodeBase64 = await QRCode.toDataURL(urlAnimal);

    res.json({
      mensagem: 'QR Code gerado com sucesso!',
      qrCodeBase64: qrCodeBase64, // Enviando o QR Code como base64
    });
  } catch (error) {
    console.error('Erro ao gerar QRCode:', error.message);
    res.status(500).json({ mensagem: 'Erro ao gerar o QR Code.' });
  }
};


// Buscar dados de um animal pelo ID (corrigido para pegar de dentro do produtor)
const obterAnimal = (req, res) => {
  const { idProdutor, animalId } = req.params;
  const usuarios = readData();

  const produtor = usuarios.find(usuario => usuario.id === parseInt(idProdutor, 10));
  if (!produtor) {
    return res.status(404).json({ mensagem: 'Produtor não encontrado.' });
  }

  const animal = produtor.animais.find(a => a.identificacao_animal === animalId);
  if (!animal) {
    return res.status(404).json({ mensagem: 'Animal não encontrado.' });
  }

  res.json(animal);
};

// Função para adicionar um novo animal
const adicionarAnimal = (req, res) => {
  const idProdutor = parseInt(req.params.idProdutor, 10);
  const { nome_animal, identificacao_animal, sexo, raca, data_nascimento } = req.body;

  if (!nome_animal || !identificacao_animal || !sexo || !raca || !data_nascimento) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  const usuarios = readData();

  const produtor = usuarios.find(usuario => usuario.id === idProdutor);
  if (!produtor) {
      return res.status(404).json({ mensagem: 'Produtor não encontrado.' });
  }

  // Criando o novo animal
  const novoAnimal = {
      nome_animal,
      identificacao_animal,
      sexo,
      raca,
      data_nascimento,
      foto: 'default-animal.jpg' // Adicione uma foto padrão, se necessário
  };

  produtor.animais.push(novoAnimal);

  // Salvar as alterações no db.json
  try {
      const dataPath = path.join(__dirname, '../data/db.json');
      fs.writeFileSync(dataPath, JSON.stringify({ usuarios }, null, 2), 'utf8');
      res.status(201).json({ mensagem: 'Animal adicionado com sucesso.', animal: novoAnimal });
  } catch (error) {
      console.error('Erro ao salvar o arquivo db.json:', error.message);
      res.status(500).json({ mensagem: 'Erro ao salvar o novo animal.' });
  }
};

const atualizarAnimal = (req, res) => {
  const { idProdutor, idAnimal } = req.params;
  const { nome_animal, sexo, raca, data_nascimento, codigo_rastreamento, procedencia, historico_saude, outras_informacoes } = req.body;

  const usuarios = readData();

  // Encontra o produtor pelo id
  const produtor = usuarios.find(usuario => usuario.id === parseInt(idProdutor, 10));
  if (!produtor) {
    return res.status(404).json({ mensagem: 'Produtor não encontrado.' });
  }

  // Encontra o animal pelo id dentro do produtor
  const animal = produtor.animais.find(animal => animal.identificacao_animal === idAnimal);
  if (!animal) {
    return res.status(404).json({ mensagem: 'Animal não encontrado.' });
  }

  // Atualiza os dados do animal com as informações recebidas, se presentes
  animal.nome_animal = nome_animal || animal.nome_animal;
  animal.sexo = sexo || animal.sexo;
  animal.raca = raca || animal.raca;
  animal.data_nascimento = data_nascimento || animal.data_nascimento;
  animal.codigo_rastreamento = codigo_rastreamento || animal.codigo_rastreamento;
  animal.procedencia = procedencia || animal.procedencia;
  animal.historico_saude = historico_saude || animal.historico_saude;
  animal.outras_informacoes = outras_informacoes || animal.outras_informacoes;

  // Salva os dados atualizados no db.json
  try {
    const dataPath = path.join(__dirname, '../data/db.json');
    fs.writeFileSync(dataPath, JSON.stringify({ usuarios }, null, 2), 'utf8');
    res.status(200).json({ mensagem: 'Animal atualizado com sucesso.', animal });
  } catch (error) {
    console.error('Erro ao salvar o arquivo db.json:', error.message);
    res.status(500).json({ mensagem: 'Erro ao salvar os dados atualizados do animal.' });
  }
};


module.exports = {
  getAnimalsByProducerId,
  getAnimalById,
  gerarQRCode,
  obterAnimal,
  adicionarAnimal,
  atualizarAnimal, // Certifique-se de que a função 'atualizarAnimal' está sendo exportada corretamente
};
