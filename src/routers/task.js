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

// GET/tasks?completed=true or false 
// GET/tasks?limit=10&skip=0 10 task to be fetched and 1st page because skip is 0. skip 10 will be 2nd page
// GET/tasks?createdAt:asc 1st part is the field to be sorted, 2nd part is sort order
// asc is 1, desc is -1 can use : or _ as separator 
router.get('/tasks', auth, async (req, res)=>
{
    const match = {} // create an empty object 
    
    if ( req.query.completed )
    {
        match.completed = req.query.completed === 'true' // query is string but match is boolean
    }

    const sort = {}

    if ( req.query.sortBy )
    {    // break up the value of sortBy
        const parts = req.query.sortBy.split(':')
        // parts[0] is the field to be sorted,order is either desc is -1 and asc is 1
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1 
    }
    try {
           //const tasks = await Task.find({ owner: req.user._id})
           // alternative way await req.user.populate('tasks')
            await req.user.populate({
             path: 'tasks',
             match: match,
             options: { limit: parseInt(req.query.limit),
                        skip: parseInt(req.query.skip),
                        sort: sort
                    } // options for pagination or sorting and limit to no. of task
            })
            //res.send(tasks) 
             res.send(req.user.tasks)
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