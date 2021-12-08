const mongoose = require('mongoose')
const validator = require('validator')

// define a task Schema
const taskSchema = new mongoose.Schema(
    {
        description: { type: String, required: true, trim: true },
        completed: { type: Boolean, default: false}, 
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'} // create relationship between User model and this field
        
        
    }, { timestamps: true } // enable timestamps to track CreatedAt and UpdatedAt
    )
// define a  model name Task 
const Task = mongoose.model('Task', taskSchema)


/*const task = new Task(
    { description: '   Clean bathrooms'}
  )

task.save().then((task) =>
{
    console.log(task)

}).catch((error) =>
{
    console.log(error)
})*/

module.exports = Task
