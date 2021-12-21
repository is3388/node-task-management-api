const app = require('../src/app') 
const request = require('supertest')
const mongoose = require('mongoose')
const Task = require('../src/models/task')
const { userOne, userTwo, taskOne, taskTwo, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase) // before each test, call async function to populate the database

test('Should create task for user', async() =>
{
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ description: 'Prepare Christmas party'})
    .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

// test not create task with invalid description or completed
test('Should not create task with invalid description and completed', async() =>
{
    await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ description: 111, completed: 101 })
    .expect(400)
})

// get all tests for userOne
test('Should fetch user tasks', async() =>
{
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    expect(response.body.length).toBe(2)
})

// not get user tasks for unauthenticated user
test('Should not fetch other user tasks', async() =>
{
    await request(app)
    .get('/tasks/${userTwoId')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(500)
    
})

// fetch user task by id
test('Should fetch user task by id', async() => {
    const response = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body.description).toEqual(taskOne.description)
})

// Should fetch only completed tasks
test('fetch only completed tasks', async () => {
    const response = await request(app)
        .get('/tasks?completed=true')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
 
    expect(response.body.length).toEqual(1)
})

// Should fetch only incomplete tasks
test('fetch only incompleted tasks', async () => {
    const response = await request(app)
        .get('/tasks?completed=false')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
 
    expect(response.body.length).toEqual(1)
})

// sort tasks by description
test('Should sort tasks by description', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=description:desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        
    expect(response.body[0].description).toEqual('Second task')
})

// sort tasks by completed
test('Should sort tasks by completed', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=completed:desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
 
    expect(response.body[0].description).toBe('Second task')
}) 
 
// sort tasks by createdAt
test('Should sort tasks by createdAt', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=createdAt:desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
 
    expect(response.body[0].description).toBe('Second task')
})

// sort tasks by updatedAt
test('Should sort tasks by updatedAt', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=updatedAt:desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
 
    expect(response.body[0].description).toBe('Second task')
})
 
// fetch page of tasks
test('Should fetch page of tasks', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=createdAt:desc&limit=1&skip=1')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
 
    expect(response.body[0].description).toBe('First task')
})

// update task with valid user 
test('Should update task with authenticated user', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: 'true'
        })
        .expect(200)
    const task = await Task.findById(taskOne._id)
    expect(task.completed).toEqual(true)
})

// not update task with invalid description/completed
test('Should not update task with invalid description', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: ''
        })
        .expect(400)
})

// not update other users task
test('Should not update other users task', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            description: 'test not update other users task',
        })
        .expect(400)
})

// test delete a task from invalid user
test('Should not delete other user tasks', async()=>
{
    await request(app)
    .delete('/tasks/${taskOneId}')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
    const task = Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})


/*afterAll( async () => {
    await mongoose.connection.close();
  })*/