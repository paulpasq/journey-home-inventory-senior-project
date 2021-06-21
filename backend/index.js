const express = require('express');
const verify = require('./routes/verifyToken');
const cookieParser = require('cookie-parser');
const app = express();

require('dotenv').config();

// import routes
const donationRoute = require('./routes/donation');
const donatorRoute = require('./routes/donator');
const userRoute = require('./routes/user');

// middleware
//app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cookieParser());
app.use(express.static('public'))
app.use('/images', express.static('public'))
// route middleware
app.use('/user', userRoute);
app.use('/donation', verify, donationRoute);
app.use('/donator', verify, donatorRoute);
// start listener
app.listen(5000, () => {
    console.log('Server started');
});