const sequelize = require('sequelize');
const database = require('../database');
const donator = require('./Donator');
const Donation = database.define('Donation', {
    //Primary key
    //DonationID
    DonationID: {
        //An auto incremented primary key int, therefore cannot be null
        type: sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
    },
    //Foreign Key to Donator
    DonatorID: {
        //A foreign key int, therefore cannot be null
        type: sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: database.Donator,
            key: 'DonatorID'
        }
    },
    //Other Attributes
    //Name
    Name: {
        type: sequelize.STRING
    },
    //Quantity
    Quantity: {
        type: sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isNumeric: true
        }
    },
    //Tag
    Tag: {
        type: sequelize.STRING,
        allowNull: false,
    },
    //Condition
    Condition: {
        type: sequelize.ENUM,
        allowNull: false,
        values: ['Ready', 'In Need Of Repair']
    },
    //Primary Category
    PrimaryCategory: {
        type: sequelize.ENUM,
        allowNull: false,
        values: ['Kitchen', 'Bedroom', 'Living Room', 'Bathroom', 'Other']
    },
    //Secondary Category
    SecondaryCategory: {
        type: sequelize.STRING,
        allowNull: false
    },
    //Date Recieved
    DateRecieved: {
        type: sequelize.DATE,
        allowNull: false,
        validate: {
            is: /(\d{4}-\d{2}-\d{2})?/
        }
    },
    //Date Donated
    DateDonated: {
        type: sequelize.DATE,
        allowNull: true,
        validate: {
            is: /(\d{4}-\d{2}-\d{2})?/
        }
    },
    //Has this been donated yet?
    Archived: {
        type: sequelize.BOOLEAN
    },
    //Property to store photos
    Photo: {
        type: sequelize.STRING,
        allowNull: true
    }

},
{   // sequelize will automatically update these fields
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});



//Export
module.exports = Donation;