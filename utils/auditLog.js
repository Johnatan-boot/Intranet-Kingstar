const fs = require('fs');
const path = require('path');
const logPath = path.join(__dirname, '../data/audit.log');

module.exports = (acao, user) => {
  const linha = `[${new Date().toISOString()}] ${user.id} (${user.role}) - ${acao}\n`;
  fs.appendFileSync(logPath, linha);
};


