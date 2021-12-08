require('../src/db/mongoose')
const Task = require('../src/models/task')

//61a4fe9172cb0a693ade35fe
/*Task.findByIdAndDelete('61a4fe9172cb0a693ade35fe').then((task) =>
{
    console.log(task)
    return Task.countDocuments({completed: false})
}).then((result) =>
{
    console.log(result)
}).catch((error) =>
{
    console.log(error)
})*/

// Use Async await to delete a task and count all incomplete tasks
const deleteTaskAndCount = async(id) =>
{
  const task = await Task.findByIdAndDelete(id) 
  const count = await Task.countDocuments({completed: false}) 
  return count
}

deleteTaskAndCount('61a013ec77d7ae211a703965').then((count) =>
{
    console.log(count)
}).catch((e)=>
{
    console.log(e)
})
