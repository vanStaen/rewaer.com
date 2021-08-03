const { sequelize, DataTypes } = require('../lib/sequelizedb');
const { User } = require('./User');

const Item = sequelize.define("item", {
  _id: {
    type: DataTypes.INTEGER,
    field: "_id",
    autoIncrement: true,
    primaryKey: true,
  },
  mediaUrl: {
    type: DataTypes.STRING,
    required: true,
  },
  mediaUrlThumb: {
    type: DataTypes.STRING,
    required: true,
  },
  mediaUrlMedium: {
    type: DataTypes.STRING,
    required: true,
  },
  title: {
    type: DataTypes.STRING,
    required: false,
  },
  category: {
    type: DataTypes.STRING,
    required: false,
  },
  desc: {
    type: DataTypes.STRING,
    required: false,
  },
  colors: {
    type: DataTypes.STRING,
    required: false,
  },
  brand: {
    type: DataTypes.STRING,
    required: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    required: true,
    default: true,
  },
  favorite: {
    type: DataTypes.BOOLEAN,
    required: true,
    default: false,
  },
});

User.hasMany(Item);
Item.belongsTo(User);

module.exports = {
  Item
};