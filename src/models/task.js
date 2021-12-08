const mongoose = require('mongoose')
const validator = require('validator')


// define a  model name Task with 2 fields
const Task = mongoose.model('Task', 
{
    description: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false}, 
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'} // create relationship between User model and this field


})


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
