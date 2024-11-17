// backend/utils/ipUtils.js
const os = require('os');

const getLocalIPAddress = () => {
  const networkInterfaces = os.networkInterfaces();
  for (let interfaceName in networkInterfaces) {
    for (let iface of networkInterfaces[interfaceName]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address; // Retorna o primeiro IP não interno encontrado
      }
    }
  }
  return 'IP não encontrado'; // Retorna uma mensagem caso nenhum IP seja encontrado
};

module.exports = {
  getLocalIPAddress
};
