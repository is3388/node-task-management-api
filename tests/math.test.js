// destructure the math object as we only need that function
const {calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math')
// create test cases and call test function provided by jest
// 1st arg is the test case name which is a string
// 2nd arg is a function contains the code you run to verify a given feature.
// if the function throws an error will be failure, otherwise success

test('Should calculate total with tip', () =>
{
    const total = calculateTip(30, 0.2)
    expect(total).toBe(36)
    /*if ( total !== 36)
    {
        throw new Error(`Total should be 33. Got only $(total)`)
    }*/
})

test('Should calculate total with default tip', () =>
{
    const total = calculateTip(30)
    expect(total).toBe(37.5)
    
})

test('Should convert 32 F to 0 C', () => {
    const temp = fahrenheitToCelsius(32)
    expect(temp).toBe(0)
})

test('Should convert 0 C to 32 F', () => {
    const temp = celsiusToFahrenheit(0)
    expect(temp).toBe(32)
})

test('Async test demo', (done) =>
{
    setTimeout(() =>
    {
        expect(1).toBe(1)
        done()
    }, 2000)
})
// test async function must pass done and call done() to tell Jest to assert when the async process is done
test('Should add two numbers', (done) =>
{
    add(2,3).then((sum) =>
    {
        expect(sum).toBe(5)
        done()
    })
})

// alternative way to test async function that Jest will wait for the returned Promise either fulfilled or rejected
// before figure out the test case to be success or failure, so just want for everything done using await
test('Should add two numbers async/await', async () =>
{
    const sum = await add(10, 23)
    expect(sum).toBe(33)
})

// test case 2, it will fail as it explicitly throw an error
/*test('This should fail', () =>
{   
    throw new Error('Failure!')

})*/

