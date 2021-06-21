const jwt = require( 'jsonwebtoken' );

/*
Checks if the user's login token is expired
*/
module.exports = function verify( req, res, next ) {
    const token = req.cookies.session_token;

    //If there is a token
    if ( token ) {
        try {
            const verified = jwt.verify( token, process.env.TOKEN_SECRET );
            
            //If the tokens expiration time is later than the current time
            if ( new Date( verified.expires ).getTime() > new Date().getTime() ) {
                //Verify the user
                req.user = verified;
                next();
            //If their token has expired
            } else {
                res.status( 401 ).send({
                    result: 1,
                    message: 'Expired token'
                });
            }
        //If they have a bad token, notify them
        } catch ( err ) {
            res.status( 401 ).send({
                result: 1,
                message: 'Invalid token'
            });
        }
    //If they don't even have a token, deny access
    } else {
        res.status( 401 ).send({
            result: 1,
            message: 'Access denied'
        });
    }
}