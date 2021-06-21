const router = require('express').Router();
const sequelize = require('sequelize');
const donator = require('../models/Donator');
const donation = require('../models/Donation');
const settings = require('../models/Settings');
const pick = require('lodash.pick');
const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer')
const { promisify } = require('util')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/')
    },
    filename: function (req, file, cb) {
      cb(null, 'upload' + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
    
  })
  
  var upload = multer({ 
      storage: storage,
      limits : {fileSize : 20000000} //20MB upload limit
     })

const unlinkAsync = promisify(fs.unlink)



router.get('/settings', async (req, res) => {
    try {
        const emailString = await settings.findAll({
            where: {SettingID: 0}
        });
        res.send(emailString);

    } catch (err) {
        console.error(err);
        res.sendStatus(500).send({
            result: 1,
            message: 'GET counts request failed'
        });
    }

});

router.patch('/settings', async (req, res) => {
    try {
        const attributes = {
            EmailBody: req.body.EmailBody.trim(),
            EmailHeader: req.body.EmailHeader.trim(),
        };
        settings.update(attributes, {
            where: { SettingID: 0 }
        }).then(async () => {
            const result = await settings.findAll({
                where: { SettingID: 0 }
            });
            res.send(result);
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500).send({
            result: 1,
            message: 'GET counts request failed'
        });
    }

});


router.get('/', async (req, res) => {

    try {
        // http req filtering
        const donation_query = pick(req.query, Object.keys(donation.tableAttributes));


        // set date ranges to min/max
        // DATE RECEIVED
        if (typeof req.query.DateRecieved !== 'undefined') {
            donation_query.DateRecieved = { [sequelize.Op.is]: new Date(req.queryDateRecieved) };
        } else {
            var date_received_start = new Date(1970 - 01 - 01);
            var date_received_end = new Date(new Date().setFullYear(new Date().getFullYear() + 1000));

            if (typeof req.query.date_received_start !== 'undefined') {
                date_received_start = new Date(req.query.date_received_start);
            }
            if (typeof req.query.date_received_end !== 'undefined') {
                date_received_end = new Date(req.query.date_received_end);
            }

            donation_query.DateRecieved = {
                [sequelize.Op.gte]: date_received_start,
                [sequelize.Op.lte]: date_received_end
            };
        }
        // END DATE RECEIVED
        // DATE DONATED 
        // if a donated date is specified:
        if (typeof req.query.date_donated_start !== 'undefined' ||
            typeof req.query.date_donated_end !== 'undefined' ||
            typeof req.query.DateDonated !== 'undefined') {

            // if a donated date is set to null -- check for only nulls    
            if (req.query.date_donated_start == 'null' ||
                req.query.date_donated_end == 'null' ||
                req.query.DateDonated == 'null') {

                donation_query.DateDonated = { [sequelize.Op.is]: null };

            } else {
                // if a single donation date is specified:
                if (typeof req.query.DateDonated !== 'undefined') {

                    donation_query.DateDonated = { [sequelize.Op.is]: new Date(req.query.DateDonated) };

                    // if a date range is specified:
                } else {
                    var date_donated_start = new Date(1970 - 01 - 01);
                    var date_donated_end = new Date(new Date().setFullYear(new Date().getFullYear() + 1000));

                    if (typeof req.query.date_donated_start !== 'undefined') {
                        date_donated_start = new Date(req.query.date_donated_start);
                    }
                    if (typeof req.query.date_donated_end !== 'undefined') {
                        date_donated_end = new Date(req.query.date_donated_end);
                    }

                    donation_query.DateDonated = {
                        [sequelize.Op.gte]: date_donated_start,
                        [sequelize.Op.lte]: date_donated_end
                    };
                }
            }
        }
        // END DATE DONATED

        // perform query
        const result = await donation.findAll({
            where: donation_query,
        });
        res.send(result);
    } catch (err) {
        console.log(err);
        res.sendStatus(500).send({
            result: 1,
            message: 'GET request failed'
        });
    }
});

router.get('/column', async (req, res) => {
    try {
        const attribute = req.query.attribute;

        if (typeof attribute == 'undefined') {
            res.sendStatus(400).send({
                result: 1,
                message: 'Attribute not defined'
            });
        }

        donation.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col(attribute)), attribute]
            ]
        }).then((result) => {
            var distAttribute = new Array();
            result.forEach(value => {
                distAttribute.push(Object.values(value.dataValues)[0]);
            });
            res.send(distAttribute);
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500).send({
            result: 1,
            message: 'GET column request failed'
        });
    }
});

router.get('/count', async (req, res) => {
    try {
        const result = await donation.findAll({
            attributes: [
                'SecondaryCategory',
                [sequelize.fn('SUM', sequelize.col('Quantity')), 'Quantity']
            ],
            where: { Archived: 0 },
            group: ['SecondaryCategory']
        });
        res.send(result);

    } catch (err) {
        console.error(err);
        res.sendStatus(500).send({
            result: 1,
            message: 'GET counts request failed'
        });
    }
});
router.post('/', upload.single('upload'), async (req, res) => {


    try {
        const attributes = {
            DonatorID: req.query.DonatorID.trim(),
            Name: req.query.Name.trim(),
            PrimaryCategory: req.query.PrimaryCategory.trim(),
            SecondaryCategory: req.query.SecondaryCategory.trim(),
            Condition: req.query.Condition.trim(),
            Tag: crypto.randomBytes(4).toString('hex'),
            DateRecieved: new Date(req.query.DateRecieved),
            Archived: (req.query.Archived === null ? true : false) //If no archived specify, assume to not archive

        };
        
        if(req.file)
        {
            console.log("Photo detected @ " + req.file.path)
            attributes.Photo = req.file.filename
        }




        if (typeof req.query.Quantity !== 'undefined') { attributes.Quantity = req.query.Quantity.trim() };
        if (typeof req.query.DateDonated !== 'undefined') { attributes.DateDonated = new Date(req.query.DateDonated) };

        const result = await donation.create(attributes);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.sendStatus(500).send({
            result: 1,
            message: 'POST request failed'
        });
    }
});

//not working
router.post('/archive', async (req, res) => {
    try {
        const attributes = {
            DonatorID: req.body.DonatorID.trim(),
            Name: req.body.Name.trim(),
            PrimaryCategory: req.body.PrimaryCategory.trim(),
            SecondaryCategory: req.body.SecondaryCategory.trim(),
            Quantity: parseInt(req.body.Quantity.trim()),
            Condition: req.body.Condition.trim(),
            Tag: req.body.Tag.trim(),
            DateRecieved: new Date(req.body.DateRecieved),
            DateDonated: new Date(req.body.DateDonated),
            Archived: 1, //If no archived specify, assume to not archive
        };
        const createResult = donation.create(attributes);
        res.send(createResult);


    } catch (err) {
        console.log(err);
        res.sendStatus(500).send({
            result: 1,
            message: 'POST request failed'
        });
    }
});

router.patch('/', upload.single('upload'), async (req, res) => {
    try {
        const attributes = pick(req.query, Object.keys(donation.tableAttributes));
        for (const attr in attributes) {
            attributes[attr] = attributes[attr].trim();
        }

        //If no dateDonated was supplied, set date donated field = null
        if (attributes.DateDonated == "undefined") {
            attributes.DateDonated = null;
        }
        const existingDonation = await donation.findOne({
            where: { DonationID: req.query.donation_id }
        });

        if(req.query.DeletePhoto == "true" && existingDonation.Photo)
        {
            await unlinkAsync("public/"+existingDonation.Photo) 
            attributes.Photo = null
        }



        //Overwrite the photo path in the db
        if(req.file)
        {
            attributes.Photo = req.file.filename;
        }


        donation.update(attributes, {
            where: { DonationID: req.query.donation_id }
        }).then(async () => {
            const result = await donation.findAll({
                where: { DonationID: req.query.donation_id },
                include: donator,
            });
            res.send(result);
        }).catch((err) => {
            console.error(err);
            res.sendStatus(500).send({
                result: 1,
                message: 'PATCH request failed with a general database error'
            });
        });
    } catch (err) {
        console.log(err);
        res.sendStatus(500).send({
            result: 1,
            message: 'PATCH request failed'
        });
    }
});



router.delete('/', async (req, res) => {
    try {
        const existingDonation = await donation.findOne({
            where: { DonationID: req.query.DonationID }
        })
        if(existingDonation.Photo)
            await unlinkAsync("public/"+existingDonation.Photo) 

        await donation.destroy({
            where: { DonationID: req.query.DonationID }
        });

        res.send({
            result: 0,
            message: 'deletion successful'
        })
    } catch (err) {
        console.log(err);
        res.sendStatus(500).send({
            result: 1,
            message: 'DELETE request failed'
        });
    }
});

module.exports = router;