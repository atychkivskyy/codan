const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }, password: {
        type: DataTypes.STRING,
        allowNull: false
    }, isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }, isEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = User;
