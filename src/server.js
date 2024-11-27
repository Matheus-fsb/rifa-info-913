// Importa a aplicação e a configuração do banco de dados
const app = require('./app');
const sequelize = require('./config/database');
require('dotenv').config();

const port = process.env.PORT;

// Sincroniza o banco de dados com a aplicação
sequelize.sync({ force: false })
  .then(() => {
    // Inicia o servidor quando o banco de dados for sincronizado com sucesso
    app.listen(port, () => {
      console.log(`Servidor iniciado em: ${port}`);
      console.log('Banco de dados sincronizado com sucesso.');
    });
  })
  .catch((error) => {
    // Exibe um alerta de erro caso a sincronização do banco de dados falhe
    console.error('Erro ao sincronizar o banco de dados:', error.message);
  });
