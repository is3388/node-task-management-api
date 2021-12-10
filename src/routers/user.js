const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const router = new express.Router() //create a new router


/* set up route
router.get('/test', (req, res) =>
{   
    res.send('From a new file')
}) */

// set up all user related routes
// configure express to set up http requests like get request (app.get) to allow someone
// to get access to a specific route using http GET method.
// express provides us with all HTTP methods app.get/app.post/app.patch/app.delete for add endpoints
/* use promise chaining
router.post('/users', (req, res) =>
{
    //console.log(req.body)
    //res.send('testing!')
    const user = new User(req.body)
    user.save().then(() =>
    {
        res.send(user)
    }).catch((error) =>
    {
        res.status(400).send(error)
        
    })
})*/

router.post('/users', async (req, res) =>
{
    //console.log(req.body)
    //res.send('testing!')
    
    const user = new User(req.body)
    try {
            await user.save()
            // generateAuthToken for the saved user
            const token = await user.generateAuthToken()
            //res.status(201).send(user) //this code run only a promise is fulfilled
            res.status(201).send({user, token})
        }
    catch(error)
        {
            res.status(400).send(error)
        }

})
/* Use Promise Chaining
router.get('/users', (req, res) =>
{
    User.find({}).then((users) =>
    {
        res.send(users)
    }).catch((error) =>
    {
        res.status(500).send()
    })
})*/

// endpoint for user to login and send back only public profile
router.post('/users/login', async (req, res) =>
{
    //find the user by their credentials
    try
    {   // findByCredentials method is for all users which related to the user model, so User.method
        const user = await User.findByCredentials(req.body.email, req.body.password)
        // generateAuthToken for individual user, so user for specific user not User for model in general
        const token = await user.generateAuthToken()
        res.send({user, token}) // shorthand syntax user:user, token: token
        //res.send({user : user.getPublicProfile(), token})
    }
    catch(e)
    {
        res.status(400).send()
    }
})

// add endpoint for log out. We need to authenticate as we only log out one of device for the user
router.post('/users/logout', auth, async (req, res) =>
{
    try
    { // remove that particular token from user.tokens array
        req.user.tokens = req.user.tokens.filter((token) =>
        {// token object has _id property and token property, therefore token.token
            return token.token!== req.token // return T if that token is no longer inside the array
        })
        await req.user.save()
        res.send()

    }
    catch(e)
    {
        res.status(500).send()
    }
})

// route handler to wipe out all tokens inside the user.tokens array to end all sessions at once
router.post('/users/logoutAll', auth, async (req, res) =>
{
    try
    {
        req.user.tokens = []
        await req.user.save()
        res.send() // if everything works, status code is 200
    }
    catch(e)
    {
        res.status(500).send()
    }
})

// add middleware auth as 2nd arg so that it will run before the async function which is route handler
router.get('/users/me', auth, async (req, res) =>
{ // user is not supposed to see other users info once authentication is added, so we only refactor
  // this route to be user profile. so the route change to '/users/me'
    //try {
           //const users = await User.find({})
           // res.send(users)
           // we only send back user profile
           res.send(req.user)
        //}
    //catch(error)
    //{
       // res.status(500).send()
    //}
})

/*router.get('/users/:id', (req, res) =>
{
    // aware the id if it is 12-digit number (correct format)
    const _id = req.params.id
    if(_id.toString().length!== 12) //Or if(!mongooseisValidObjectId(_id))
    {
        return res.status(404).send({error: 'Invalid ID'})
    }
    
    User.findById(_id).then((user) =>
    {
        if(!user)
        {
            return res.status(404).send()
        }
        res.send(user)
    }).catch((error) =>
    {
        res.status(500).send()
    })
})*/

/* replaced by router.get('/users/me') 
router.get('/users/:id', async (req, res) =>
{
    // aware the id if it is 12-digit number (correct format)
    const _id = req.params.id
       
    try {
            const user = await User.findById(_id)
            if(!user)
            {
                return res.status(404).send()
            }
            res.send(user)
        }
     catch (error)
    {
        res.status(500).send()
    }
}) */

// update user with async await and additional info when trying to update properties not in model
router.patch('/users/me', auth, async (req, res) =>
{
    const updates = Object.keys(req.body) // convert the request body to an array of string
    const allowedUpdates = ['name', 'email', 'age', 'password'] // properties allow to be updated
    // to get the final boolean value either true or false when validating each property
    // if 5 updates will run the code five times. If any time return F, it will F
    const isValidOperation = updates.every((update) =>
    {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation) // if false
    {
        return res.status(400).send({error: 'Invalid updates!'}) // return alter the execution and the following code will be be run
    }

    try
    {// refactor the code to prevent Mongoose bypass the middleware to run some code before saving
        //const user = await User.findByIdAndUpdate(req.params.id, req.body,{ new: true, runValidators: true })
        //const user = await User.findById(req.params.id) because already fetch during authentication
        updates.forEach((update) => //pass in whatever property to be updated
        {
            //dynamic update not static update like user.name = 'Andrew'
            req.user[update] = req.body[update]
        })
        await req.user.save()
        
        /*if(!user)
            {
                return res.status(404).send()
            }*/
            res.send(req.user)
    }
    catch (e)
    {
        res.status(400).send(e)
    }
})

// delete user with id
//router.delete('/users/:id', async ( req, res ) =>
router.delete('/users/me', auth, async ( req, res ) =>
{
    try
    {
        /*const user = await User.findByIdAndDelete(req.params.id)
        if (!user)
        {
            return res.status(404).send()
        }
        res.send(user)*/
        // since the user already fetch when doing authentication, use Mongoose method to delete user profile
        await req.user.remove()
        res.send(req.user) // send back what user is deleted
    }
    catch(e)
    {
        res.status(500).send()
    }
})

// upload user profile
// configure multer to accept what types of file. It could create multiple instances for each type.
const upload = multer({ //dest: 'avatars', // we want to save it in user profile (DB) not in file system
limits: { fileSize: 1000000 }, // max size of the file 
fileFilter( req, file, cb ) // req being made, uploaded file info, callback function
{
    //if( !file.originalname.endsWith('.pdf')) // originalname is the info of File object multer provided
    // which is the file on your PC
    if ( !file.originalname.match(/\.(jpg|png|jpeg)$/))
    {
        return cb(new Error('Please upload an image'))
    }
    cb(undefined, true) // call callback with no error and work as expected is true
}
}) // create an instance of multer and the destination folder
// that all uploaded files will be stored
// set up endpoint that user can upload files
// 1st arg is the path, 2nd arg is auth middleware to authenticate the user before
// handle upload, 3nd arg is a multer middleware call single passing the filename (the key in postman) you want to
// upload 
// if upload more than one buffer eg one for image and one for resume:
/* instead of upload.single('avatar') upload.fields([
    { name: 'avatar', maxCount: 1 }, 
    { name: 'resume', maxCount: 1 }
])*/
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) =>
{
    // pass the upload data to the callback function, so access the file.buffer and 
    // save it to associated user's avatar field in database
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) =>
{
    res.status(400).send({error: error.message}) // the error message from multer which is Please upload an image
})

// delete an image profile 
router.delete('/users/me/avatar', auth, async (req, res) => {
    if (!req.user.avatar) // no image stored in user's avatar field 
    {
        res.status(400).send('No avatar to delete!')
    }
    try {
        req.user.avatar = undefined // assign undefined to remove the value but the field is still in db 
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router



