const router = require('express').Router();
const sequelize = require('sequelize');
const donator = require('../models/Donator');
const donation = require('../models/Donation');
const pick = require('lodash.pick');
const user = require('../models/User');
const verify = require('./verifyToken');

router.get('/', async (req, res) => {
    try {

        // http req filtering
        const donator_query = pick(req.query, Object.keys(donator.tableAttributes));

        // perform query
        const result = await donator.findAll({
            where: donator_query,
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
                message: 'attribute not defined'
            });
        }

        donator.findAll({
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

router.post('/', async (req, res) => {
    try {
        if (req.body.Email.trim() === "") {
            req.body.Email = null;
        }
        if (req.body.Phone.trim() === "") {
            req.body.Phone = null;
        }
        const result = await donator.create({
            Name: req.body.Name.trim(),
            //Email: req.body.Email.trim(),
            Email: (req.body.Email === null ? req.body.Email : req.body.Email.trim()),
            Phone: (req.body.Phone === null ? req.body.Phone : req.body.Phone.trim()),
            Town: req.body.Town.trim()
        });
        // .catch(Sequelize.ValidationError, function (msg) {
        //     return res.status(422).send(err.errors);
        // });
        res.send(result);
    } catch (err) {
        
        if(err.name === 'SequelizeUniqueConstraintError')
        {
            console.log()
            res.status(409).json({ reason: 'Duplicate entry, '+err.errors[0].value+' is already in the database!' }) 
        }
        else{
        res.sendStatus(500).send({
            result: 1,
            message: 'POST request failed'
            });
        }
    }
});

router.patch('/', async (req, res) => {
    try {
        if (req.body.Email.trim() === "") {
            req.body.Email = null;
        }
        if (req.body.Phone.trim() === "") {
            req.body.Phone = null;
        }

        const attributes = pick(req.body, Object.keys(donator.tableAttributes));
        for (const attr in attributes) {
            if (attributes[attr] != null) {
                attributes[attr] = attributes[attr].trim();
            }
        }

        donator.update(attributes, {
            where: { DonatorID: req.query.DonatorID }
        }).then(async () => {
            const result = await donator.findAll({
                where: { DonatorID: req.query.DonatorID },
            });
            res.send(result);
        }).catch((err) => {     
        if(err.name === 'SequelizeUniqueConstraintError')
        {
            console.log()
            res.status(409).json({ reason: 'Duplicate entry, '+err.errors[0].value+' is already in the database!' }) 
        }
        else{
            console.error(err);
            res.sendStatus(500).send({
                result: 1,
                message: 'PATCH request failed with a general database error'
            })
        }
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
        const newDonor = {
            DonatorID: 0,

        };
        const createResult = donation.update(newDonor, {
            returning: true,
            where: {
                DonatorID: req.query.DonatorID,

            }
        }).then(
            donator.destroy({
                where: { DonatorID: req.query.DonatorID }
            }).then(
                // item deleted
            res.send({
                result: 0,
                message: 'deletion successful'
                })
            )
        );
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;