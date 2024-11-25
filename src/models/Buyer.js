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
    unique: true,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Buyer;
