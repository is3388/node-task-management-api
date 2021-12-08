const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

// use Schema
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        age: { type: Number, default: 0,
        // custom validation
        validate(value)
        {
            if(value <= 0)
            {
                throw new Error('Age must be a positive number.')
            }
        }},
        // track tokens so that allows user to login from multiple devices. user login from phone with one token generated.
        // then the user can login from desktop, so generate another token which also belongs to the same user
        //, they will be able to log out of one device while still be able to log into other
        tokens: [{ //array of token objects
            token: { type: String, required: true}
        }],
        email: {
            type: String,
            unique: true, // DB will create an index 
            required: true,
            trim: true,
            lowercase: true,
            async validate(value)
            {
                if (!validator.isEmail(value))
                {
                    throw new Error('Email is invalid')
                }
               /* const isEmailPresent = await User.findOne({value})
                if(isEmailPresent)
                {
                    throw new Error('Email already exists')
                }*/
            }
        },
        password: {
            type: String,
            trim: true,
            // minLength: 7
            validate(value)
            {
                if(value.length < 7)
                {
                    throw new Error('Password length must be greater than 7.')
                }
                if(value.toLowerCase().includes('password'))
                {
                    throw new Error('Password should not contain password.')
                }
            }
            
        }
    
    }

)

// define an instance method to return only certain user's data to client
// if an object here is user being stringified (res.send(user)) has a property named toJSON,
// it will customize and alter the behavior. JSON.stringify() will calls toJSON. 
// so it runs the function below before sending to the client res.send(user) 
userSchema.methods.toJSON = function ()
{
    const user = this
    //return only raw object with user data no password and tokens array, using Mongoose method to get it done
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    console.log(userObject)
    return userObject
}

// define a virtual field/attribute (Mongoose provided) for Mongoose to figure out the relationship between two entities.
// we don't want to store an array of tasks in user model.
userSchema.virtual('tasks', { ref: 'Task',
                             localField: '_id',
                             foreignField: 'owner'

}) // pass in the virtual field name and the related model

// define a instance method to generate an auth token
userSchema.methods.generateAuthToken = async function ()
{
    const user = this
    console.log(user._id)
    console.log(user.id)
    const token = jwt.sign({_id: user.id.toString()}, 'thisisagreatcourse')
    // add newly generated token to the tokens array which belong to this specific user iand save it to DB. 
    user.tokens = user.tokens.concat({token: token})
    await user.save()
    return token
}


// define a custom method to check login user's credential
// use statics for model method, so that we can access the method via User model - User.findByCredentials
userSchema.statics.findByCredentials = async (email, password) =>
{
    const user = await User.findOne({email: email})
    if (!user)
    {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password) // compare plain text with the hashed pwd in DB
    if (!isMatch)
    {
        throw new Error('Unable to login')
    }
    return user

}


// use a method on userSchema to set the middleware up. middleware is something with some functions
// to run before or after an event occurs. save(),validate(), remove(), init() methods 
// 1st arg must be event and 2nd arg must not be arrow function because this won't bind
// this code must place before user model is created because it is a middleware set up in Schema.
// hash the plain text password before saving
userSchema.pre('save', async function(next)
{
    const user = this //this reference to document to be saved which will be a new user
  //hash the plain text password
  //console.log('Just before saving!') 
  if(user.isModified('password'))
  {
      user.password = await bcrypt.hash(user.password, 8)
      // const salt = await bcrypt.genSalt(10)
      // const hashedPassword =await bcrypt.hash(req.body.password, salt) 
  }

  // call next when it is done
  next() 
})

// define a middleware to run the code to delete all tasks related to the user when a user is removed
userSchema.pre('remove', async function(next)
{
    const user = this
    await Task.deleteAll({owner: user._id})
    next()
})
const User = mongoose.model('User', userSchema)
User.createIndexes() 

 // define a model name User with 2 fields not using Schema
/* const User = mongoose.model('User', 
{
    name: { type: String, required: true, trim: true },
    age: { type: Number, default: 0,
    // custom validation
    validate(value)
    {
        if(value <= 0)
        {
            throw new Error('Age must be a positive number.')
        }
    }},
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value)
        {
            if (!validator.isEmail(value))
            {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        // minLength: 7
        validate(value)
        {
            if(value.length < 7)
            {
                throw new Error('Password length must be greater than 7.')
            }
            if(value.toLowerCase().includes('password'))
            {
                throw new Error('Password should not contain password.')
            }
        }
        
    }

}) */

/*//create an instance of model
const heidi = new User({name: 'Heidi', age: 26, email: 'heidi101@example.com', password: ' Lucky123' })

//save the model instance to database. save the data and return a Promise
heidi.save().then((heidi) =>
{
    console.log(heidi)

}).catch((error) =>
{
    console.log(error)
})*/

module.exports = User
