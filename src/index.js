const app = require('./app') // load app.js to access Express app

//define port 
const port = process.env.PORT 

// set up express middleware which is function that not allow GET request to run route handler
// express middleware must be the first code before other app.use(). pass in req, res and next to move
// onto next event/action in the chain
/* app.use((req, res, next) =>
{
    if(req.method === 'GET')
    {
        res.send('GET requests are disabled')
    }
    else
    {
        next()
    }

}) */

// set up express middleware for maintenance mode
/*app.use((req, res, next) =>
{   //all incoming requests
     res.status(503).send('The site is currently under maintenace. Please try back soon.')
    
})*/

app.listen(port, () =>
{
    console.log('Server is up on port '+ port)
})

/* code for using hashed password not plain text password
    const bcrypt = require('bcryptjs')
    const myFunction = async() =>
    {
    const password = 'Red123!'
    const hashedPassword = await bcrypt.hash(password, 8) // 2nd arg is number of round to perform algorithm
    console.log(hashedPassword)
        // compare user's password with the one stored in database
    const isMatch = await bcrypt.compare(password, hashedPassword) // true of false
    }
    myFunction() */

    /*const jwt = require('jsonwebtoken')
    const myFunction = async () =>
    { // sign method to create a token passing 1st arg is an object with unique ID, 2nd arg is the secret which randomly series of characters
    // 3 arg is expiration in string. if expires, you will see token expired
     const token = jwt.sign({_id:'abc123'}, 'thisisgreatcourse', {expiresIn: '7 days'})
        console.log(token)
        // verify if token is valid. 1st arg is the token to be verified, 2nd is the secret
        const data = jwt.verify(token, 'thisisgreatcourse')
        //return either payload(body) of the token or error saying invalid signature
        console.log(data)
    }
    myFunction()*/
    /* example
    const Task = require('./models/task')
    const User = require('./models/user')

    const main = async () =>
    {
      const task = await Task.findById('61afe6b69d01f9bd4ba041f3')

        // find the user associated with the task. The task owner will now be the profile or the entire document 
        // not only the ID
        await task.populate('owner')
        console.log(task)
        console.log(task.owner)
        const user = await User.findById('61b0c8f7b9eaf9aae2a0c63d')// tim
        await user.populate('tasks') // populate is Mongoose provided
        console.log(user.tasks)
    }

    main()*/
 // file upload example
    const multer = require('multer')
    // configure multer to accept what types of file. It could create multiple instances for each type.
    const upload = multer( {
        dest: 'images', // images is the name of the folder created that all uploaded files will be stored
        limits: { fileSize: 1000000 }, // max size of the file 
        fileFilter( req, file, cb ) // req being made, uploaded file info, callback function
        {
            //if( !file.originalname.endsWith('.pdf')) // originalname is the info of File object multer provided
            // which is the file on your PC
            if ( !file.originalname.match(/\.(doc|docx)$/))
            {
                return cb(new Error('Please upload a Word document'))
            }
            cb(undefined, true) // call callback with no error and work as expected is true
        }

    }) 
    // set up endpoint that user can upload files
    // 1st arg is the path, 2nd arg is a multer middleware call single passing the filename you want to
    // upload 
   /* app.post('/upload', upload.single('upload'), (req, res) =>
    {
      res.send()  
    }
    )*/

    /* example of using middleware for Express to show appropriate error message when file upload fails
    
       const errorMiddleware = ( req, res, next ) =>
    {
        // every time throw a new error
        throw new Error('From my middleware')
    } */
    // route handler only runs when thing goes well, so we need a callback to handle error
    app.post('/upload', upload.single('upload'), ( req, res ) =>
    {
        res.send()
    }, (error, req, res, next) =>
    {
        res.status(400).send({error: error.message}) // the error message from multer which is Please upload a Word document
    })

    
 /*  const avatarUpload = profileUpload.single('avatar')
 
router.post("/users/me/avatar", (req, res) => {
    avatarUpload(err, req, res => {
        if(err) {
            return res.status(400).send({error: err.message})
        }
        if(!req.file) {
            return res.status(400).send({error: 'Please provide a image'})
            return res.status(422).joson({ message: 'A file is required' })
        }
        res.send()  
    }) 
})*/



    