const { BOOLEAN } = require('sequelize');
const sequelize = require('sequelize');
const database = require('../database');


const User = database.define('User', {

    //Primary key
    //UserID
    UserID: {
        type: sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
    },
    //Other Attributes
    //Email
    Email: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            len: [2, 255]
        }
    },
    //Password
    Password: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: [8, 512]
        }
    },
    //IsAdmin
    IsAdmin: {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
},
{   // sequelize will automatically update these fields
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

//Export
module.exports = User;