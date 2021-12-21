const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')


// create new user for testing login, update user profile, create task, add avatar or delete user account
const userOneId = new mongoose.Types.ObjectId()
const userOne = 
    { _id: userOneId, name: 'Mike', email: 'mike@example.com', password: '56what!!!', age: 27,
        tokens:[{
                token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
                }]
    }

// set up another user 
const userTwoId = new mongoose.Types.ObjectId()
const userTwo = 
        { _id: userTwoId, name: 'Steve', email: 'steve@example.com', password: 'DingDing111!', age: 20,
            tokens:[{
                    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
                    }]
        }

// set up tasks
const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userOne._id // userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOne._id // userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: true,
    owner: userTwo._id // userTwoId
}

const setupDatabase = async() =>
{
    await User.deleteMany() // clear all test data before saving the sample user
    await Task.deleteMany() // clear all test data before saving the sample task
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    setupDatabase
}