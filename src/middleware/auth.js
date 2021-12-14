const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) =>
{
    try
    {
        // the token from request header contains 'Bearer' at the beg, we need to remove it
        const token = req.header('Authorization').replace('Bearer ', '') 
        // check if token is actually valid that created by server and hasn't been expired
        // decoded is the decoded payload (body)and verify the token with the exact secret that generates the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // if token is valid, we can find the associated user in the db
        // we embed the user's id as part of the token
        // this token is part of user.tokens array. when user logs out, the token should be deleted
        // so we make sure the token object is inside of the token array. To do this, we set up another object
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
    
        if (!user)
        {
            throw new Error() // it will trigger catch block
        }
        //if user is found. Do 2 things call next() to run route handler. Give the route handler
        // access to the user fetched from db. As we already fetch user here, so no need for route 
        // handler to fetch user again. We can add a property onto request req.property to store this and
        // the route handler will be able to access later .
        req.token = token // for logout with this specific token for a device. We don't want to logout all user's device
        req.user = user
        next()

    }
    catch(e)
    {
        res.status(401).send({error: 'Please authenticate.'})
    }
}

module.exports = auth