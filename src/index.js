const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
//const User = require('./models/user')
//const Task = require('./models/task')

const app = express()

//define port 
const port = process.env.port || 3000

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
// configure express to auto parse incoming JSON to an object, so that we can access it in request handler
app.use(express.json())

// register router
app.use(userRouter)
app.use(taskRouter)

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
    // example
    const Task = require('./models/task')
    const User = require('./models/user')

    const main = async () =>
    {
       /*const task = await Task.findById('61afe6b69d01f9bd4ba041f3')

        // find the user associated with the task. The task owner will now be the profile or the entire document 
        // not only the ID
        await task.populate('owner')
        console.log(task)
        console.log(task.owner)*/
        const user = await User.findById('61b0c8f7b9eaf9aae2a0c63d')// tim
        await user.populate('tasks') // populate is Mongoose provided
        console.log(user.tasks)
    }

    main()
    