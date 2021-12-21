const app = require('../src/app') 
const request = require('supertest')
const mongoose = require('mongoose')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')

/*beforeEach( async () =>
{
    await User.deleteMany() // clear all test data before saving the sample user
    await new User(userOne).save()
})*/

beforeEach(setupDatabase) // before each test, call async function to populate the database

/* beforeEach(( done ) =>
{
    await User.deleteMany()
    done()
}) */

// afterEach(), beforeAll(), afterAll()

// test user sign up
test('Should signup a new user', async () =>
{
    /* we want to load in Express app and pass it to request which is var for SuperTest 
    to make request with data to specific endpoint
    and see if we get status 201 Created back. */
    // chain in the HTTP request method and then use send to provide an object containing.
    // finally make assertion to get 201 user created.
    // response var contains user profile like token and all user properties
    const response = await request(app).post('/users').send({
        name: 'Dave', age: 27, email: 'dave@example.com', password: 'MyPass888!'    
    }).expect(201)
    
    // assert that database was changed correctly.user._id is because user and token are sent back in model.js 
    const user = await User.findById(response.body.user._id) //based on the response body to fetch user in db
    expect(user).not.toBeNull() //if no such user, it will return null

    // assert about the response body contains user's specific property
     //expect(response.body.user.name).toBe('Ben')
    // assert about the response body in general the whole user
    //console.log(response.body)
    expect(response.body).toMatchObject({
        user:{
            name: 'Dave', 
            email: 'dave@example.com',
            },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('MyPass888!') //  the password from user is the hashed password is in database
}) 

// test not sign up a user for invalid name or email or password. Separate case for each scenario
test('Should not signup a new user', async () =>
{
    await request(app).post('/users')
    .send({
        age: 27, email: '777@example.com', password: 'MyPass777!'    
    })
    .expect(400)
})   
   
  
/* test user login
test('Should login existing user', async () =>
{
    await request(app).post('/users/login').send({ email: userOne.email, password: userOne.password })
.expect(200)
})*/

// test validate new token is saved to database when user login
test('Should new token for existing user', async () =>
{
    const response = await request(app).post('/users/login')
        .send({ email: userOne.email, password: userOne.password })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token) // tokens[0] is the token for sign up. [1] for login

})

// test nonexistent user login
test('Should not login nonexistent user', async () =>
{
    await request(app).post('/users/login').send({ email: userOne.email, password: 'SoWhat111!' }).expect(400)
})

// test getting user profile with the auth token
test('Should get profile for user', async () =>
{
    await request(app).get('/users/me') // pass the express app to supertest and test on that endpoint/http request
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`) // set Authorization header because needs to verify the user's first token value
    .send()
    .expect(200)
})

// test not getting user profile with unauthorized user without passing the authorization header
test('Should not get profile for unauthenticated user', async () =>
{
    await request(app).get('/users/me') 
    .send()
    .expect(401)
})

test('Should not signup user with invalid email', async () => {
    await request(app)
        .post('/users')
        .send({
            name:'James',
            email: 'example.com',
            password: 'superCool!'
        })
        .expect(400)
})
 
test('Should not signup user with invalid password', async () => {
    await request(app)
        .post('/users')
        .send({
            name:'Maggie',
            email: 'maggie@example.com',
            password: 1133
        })
        .expect(400)
})
 
// Not update user if unauthenticated
test('Should not update user if unauthenticated', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: 'Jen'
        }).expect(401)
})
 
// Should not update user with invalid name/email/password
test('Should not update user with invalid name', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: ''
        }).expect(400)
})
 
test('Should not update user with invalid email', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: 'example.com'
        }).expect(400)
})
 
test('Should not update user with invalid password', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: 113
        }).expect(400)
})
 

// test deleting account for authenticated user
test('Should delete account for authenticated user', async () =>
{
    await request(app).delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`) 
    .send()
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

// test not deleting account for unauthenticated user
test('Should not delete unauthenticated user', async () =>
{
    await request(app).delete('/users/me') 
    .send()
    .expect(401)
})

// test case for upload image profile pic
// fixtures or fixture dir is for testing and that's where image file is placed
test('Should upload avatar image', async() =>
{
    await request(app).post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg') // supertest method to attach file with field name and path
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

// update valid user fields
test('Should update valid user fields', async() =>
{   
    await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`) 
    .send({name: 'Joey'})
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toBe('Joey')
    //expect(user.name).toEqual('Joey')
})

// not update invalid user fields
test('Should not update invalid user fields', async() =>
{   
    await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`) 
    .send({location: 'New York'})
    expect(400)
})
 
afterAll( async () => {
  await mongoose.connection.close();
})
