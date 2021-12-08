const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

/* Use Promise Chaining
router.post('/tasks', (req, res) =>
{
    //console.log(req.body)
    //res.send('testing!')
    const task = new Task(req.body)
    task.save().then(() =>
    {
        res.send(task)
    }).catch((error) =>
    {
        res.status(400).send(error)
        
    })
})*/
// authenticated the owner of the task is valid or not
router.post('/tasks', auth, async (req, res) =>
{
    //console.log(req.body)
    //res.send('testing!')
    //const task = new Task(req.body) // take whatever the objects from req.body which is description and completed
    const task = new Task({... req.body, owner: req.user._id})
    try {
        
        await task.save()
        res.status(201).send(task)
    }
    catch(error) 
    {
        res.status(400).send(error)
        
    }
})

/* Use Promise chaining
router.get('/tasks', (req, res)=>
{
        Task.find({}).then((tasks) =>
        {
            res.send(tasks)
        }).catch((error) =>
        {
            res.status(500).send()
        })
})*/

router.get('/tasks', auth, async (req, res)=>
{
    try {
           const tasks = await Task.find({ owner: req.user._id})
           // alternative way await req.user.populate('tasks')
        
            res.send(tasks) // res.send(req.user.tasks)
        }
        catch(error)
        {
            res.status(500).send()
        }
})

/* Use Promise Chaining
router.get('/tasks/:id', (req, res) =>
{
    const _id = req.params.id
    if(_id.toString().length!== 12) //Or if(!mongooseisValidObjectId(_id))
    {
        return res.status(404).send({error: 'Invalid ID'})
    }
    Task.findById(_id).then((task) =>
    {
        if(!task)
        {
            return res.status(404).send()
        }
        res.send(task)
    }).catch((error) =>
    {
        res.status(500).send()
    })
}) */

router.get('/tasks/:id', auth, async (req, res) =>
{
    const _id = req.params.id
    try{
        // const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id})
        if(!task)
        {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(error) 
    {
        res.status(500).send()
    }
})

// set up http endpoint to update task with valid id
router.patch('/tasks/:id', auth, async (req, res) =>
{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

if (!isValidOperation)
{
    return res.status(400).send({error: 'Invalid updates!'})
}

try
{
    // refactor the code, use middleware to run some code before saving changes
    //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    //const task = await Task.findById(req.params.id)
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
    updates.forEach((update) =>
    {
        task[update] = req.body[update]
    })
    await task.save()
    
    if(!task)
    {
        return res.status(404).send()
    }
    res.send(task)
}
catch(e)
{
    res.status(400).send(e)
}
})

// delete task with id
router.delete('/tasks/:id', auth, async(req, res) =>
{
    try
    {
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})
        if ( !task )
        {
            res.status(404).send()
        }
        res.send(task)
    }
    catch(e)
    {
        res.status(500).send()
    }
})

module.exports = router