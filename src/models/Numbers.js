const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Buyer = require('./Buyer');

const Numbers = sequelize.define('Numbers', {
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
});

Numbers.belongsTo(Buyer, {
  foreignKey: {
    name: 'buyerId',
    allowNull: true,
  },
  as: 'buyer',
});

Buyer.hasMany(Numbers, {
  foreignKey: 'buyerId',
  as: 'numbers',
});


module.exports = Numbers;
