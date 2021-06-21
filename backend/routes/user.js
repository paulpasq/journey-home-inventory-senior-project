const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pick = require('lodash.pick');
const verify = require('./verifyToken');


const user = require('../models/User');


//API request to get USER
router.get('/', verify, async (req, res) => {
    try {
        //Checks to see if the user is not an admin, if they are not, return nothing
        if (!req.user.IsAdmin) { res.sendStatus(401); return; }

        //Prevents Password in query
        delete req.query['Passowrd'];
        //Otherwise, if user is an admin, get all Users
        const result = await user.findAll({
            where: req.query,
            //Do not retrieve Users' passwords
            attributes: { exclude: ['Password'] }
        });
        //Send the query results back
        res.send(result);

        //If there is any errors
    } catch (err) {
        //Log the error
        console.log(err);
        res.sendStatus(500).send({
            result: 1,
            message: 'Get request failed'
        });
    }
});

//API request to delete USER
router.delete('/', verify, async (req, res) => {
    try {
        //Checks to see if the user is not an admin, if they are not, return nothing
        if (!req.user.IsAdmin) { res.sendStatus(401); return; }

        //Delete the USER with the matching UserID
        await user.destroy({
            where: { UserID: req.query.UserID }
        });

        //Send result that deletion was successful
        res.send({
            result: 0,
            message: 'Deletion successful'
        })

        //If there is any errors
    } catch (err) {
        //Log the error
        console.log(err);
        res.sendStatus(500).send({
            result: 1,
            message: 'DELETE request failed'
        });
    }
});

//API requst to patch USER
router.patch('/', verify, async (req, res) => {
    try {

        //Get the users' attributes
        const attributes = pick(req.body, Object.keys(user.tableAttributes));
        //Get their UserID
        var modifiedUser = req.user.UserID;
        //For all of the attributes
        for (const attr in attributes) {
            //If it is not the password attribute
            if (attr != 'Password') {

                //Trim the attribue
                attributes[attr] = attributes[attr].trim();
            }
            //If it is the password attribute
            else {
                //Generate a new salt
                const salt = await bcrypt.genSalt(10);
                //Hash the password
                attributes[attr] = await bcrypt.hash(attributes[attr], salt);
            }
        }

        //If the user is an Admin
        if (req.user.IsAdmin) {
            //If the UserID is defined
            if (req.query.UserID !== 'undefined') modifiedUser = req.query.UserID;
            if (modifiedUser == req.user.UserID) delete attributes['IsAdmin'];
        } else {
            delete attributes['IsAdmin'];
        }
        user.update(attributes, {
            where: { UserID: modifiedUser }
        }).then(async () => {
            const result = await user.findOne({
                where: { UserID: modifiedUser },
                attributes: { exclude: ['Password'] }
            });
            res.send( result );
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
                    message: 'PATCH request failed to query specified USER'
                })
            }
        });
    } catch (err) {
        console.log(err);
        res.sendStatus(500).send({
            result: 1,
            message: 'PATCH requset failed'
        });
    }
});

router.post('/register', verify, async (req, res) => {
    try {

        // only admin users can register new users
        if (!req.user.IsAdmin) { res.sendStatus(401); return; }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const pwHash = await bcrypt.hash(req.body.Password, salt);

        const attributes = {
            Email: req.body.Email.trim(),
            Password: pwHash,
            IsAdmin: req.body.IsAdmin
        };

        await user.create(attributes);
        res.send({
            result: 0,
            message: 'User successfully created'
        });
    } catch (err) {
        if(err.name === 'SequelizeUniqueConstraintError')
        {
            console.log()
            res.status(409).json({ reason: 'Duplicate entry, '+err.errors[0].value+' is already in the database!' }) 
        }
        else{
        console.log(err);
                res.status(500).send({
                result: 1,
                message: 'User could not be created'
            });
        }
    }
});

router.post('/login', async (req, res) => {
    try {

        const acct = await user.findOne({
            where: { Email: req.body.Email.trim() }
        });

        if (!acct) {
            res.status(401).send({
                result: 1,
                message: 'Invalid Username'
            });

            return;
        }

        const validPass = await bcrypt.compare(req.body.Password, acct.Password);
        if (!validPass) {
            res.status(401).send({
                result: 1,
                message: 'Invalid Password'
            });

            return;
        }

        // create and assign token
        const expiration = new Date(new Date().getTime() + 86409000).toUTCString();
        const token = jwt.sign({ UserID: acct.UserID, IsAdmin: acct.IsAdmin, expires: expiration }, process.env.TOKEN_SECRET);

        res.cookie('session_token', token, { httpOnly: true, secure: false }).send({
            result: 0,
            message: 'Log in successful',
            UserID: acct.UserID,
            IsAdmin: acct.IsAdmin,
            expires: expiration
        });
    } catch (err) {
        console.log(err);
        res.sendStatus(500).send({
            result: 1,
            message: 'Log in failed'
        });
    }
});

router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('session_token', { path: '/', domain: 'localhost' }).send({
            result: 0,
            message: 'Log out successful',
        });
    } catch (err) {
        console.log(err);
        res.sendStatus(500).send({
            result: 1,
            message: 'Log out failed'
        });
    }
});

module.exports = router;