const app = require('./app');
const sequelize = require('./config/database');

const PORT = 3000;

sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor iniciado em: http://localhost:${PORT}`);
      console.log('Banco de dados sincronizado com sucesso.');
    });
  })
  .catch((error) => {
    console.error('Erro ao sincronizar o banco de dados:', error.message);
  });
