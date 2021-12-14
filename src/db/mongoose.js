const mongoose = require('mongoose')
//const validator = require('validator')
//connection string (URL and database name)
mongoose.connect(process.env.MONGODB_URL)
// no need for mongoose 6.x above {
    //useNewUrlParser: true,
    //useCreateIndex: true,
    //useUnifiedTopology: true
//})





