const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
//const User = require('./models/user')
//const Task = require('./models/task')

const app = express()

// configure express to auto parse incoming JSON to an object, so that we can access it in request handler
app.use(express.json())

// register router
app.use(userRouter)
app.use(taskRouter)

module.exports = app




    

   

  