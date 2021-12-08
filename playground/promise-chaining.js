// use promise chaining and mongoose to change the age of a user and then fetch the total
// number of other users with that age
// 61a50d0672cb0a693ade3601
require('../src/db/mongoose') // connect to the database
const User = require('../src/models/user')

/* Use only Promise chaining
User.findByIdAndUpdate('61a50d0672cb0a693ade3601', { age: 26}).then((user) =>
{
    console.log(user)
    return User.countDocuments({age: 26})
}).then((result) =>
{
    console.log(result)
}).catch((error) =>
{
    console.log(error)
})*/

// Using Async await
const updateAgeAndCount = async(id, age) =>
{
    const user = await User.findByIdAndUpdate(id, {age:age})
    const count = await User.countDocuments({age})
    return {user:user,
            count: count}
}
updateAgeAndCount('61a1597dab7d6d8e039982ee', 23).then((result) =>
{
    console.log(result)
}).catch((e) =>
{
    console.log(e)
})
// 61a1597dab7d6d8e039982ee