const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Buyer = sequelize.define('Buyer', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Buyer;
