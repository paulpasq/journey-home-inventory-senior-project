const sequelize = require('sequelize');
const database = require('../database');
const Donation = require('./Donation');

const Donator = database.define('Donator', {
    //Primary key
    //DonatorID
    DonatorID: {
        //An auto incremented primary key int, therefore cannot be null
        type: sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
    },
    //Other Attributes
    //Name
    Name: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: [2, 255]
        }
    },
    //Email
    Email: {
        type: sequelize.STRING,
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true,
            len: [2, 255]
        }
    },
    //Phone
    Phone: {
        type: sequelize.STRING,
        allowNull: true,
        validate: {
            len: [10, 15]
        }
    },
    //Town
    Town: {
        type: sequelize.STRING,
        allowNull: true
    }
},
{   // sequelize will automatically update these fields
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

Donator.hasMany( Donation, {
    foreignKey: 'DonatorID'
});
Donation.belongsTo( Donator, {
    foreignKey: 'DonatorID'
});




//Export
module.exports = Donator;

