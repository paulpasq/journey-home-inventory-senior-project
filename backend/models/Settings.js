const sequelize = require('sequelize');
const database = require('../database');


const Settings = database.define('Settings', {
    //Email will be ID 0 for ease of access
    SettingID: {
        type: sequelize.INTEGER.UNSIGNED,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    EmailBody: {
        type: sequelize.STRING,
        validate: {
            len: [0, 2000]
        }
    },
    EmailHeader: {
        type: sequelize.STRING,
        validate: {
            len: [0, 60]
        }
    }
},
{   // sequelize will automatically update these fields
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

//Export
module.exports = Settings;