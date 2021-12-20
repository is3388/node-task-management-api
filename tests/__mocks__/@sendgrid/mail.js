// The purpose of creating mock is because we do not want to send real emails via sendgrid when testing
// Jest looks for __mocks__ directory and mock individual module we want to mock out the functionailty like @sendgrid/mail or jsonwebtoken's functions
// we provide our own versions of setApiKey() and send() functions in account.js, so that no email will be sent off.
// @sendgrid/mail is the npm scope and @sendgrid is organization, mail is the utility
// we need to export an object with those properties setApiKey and send on because that's what sendgrid is doing
module.exports={ setApiKey() {
    // no api key is set. you can choose to accept arg and return value in mocking
    // but since we don't return anything, there is no need to pass anything.
    // we only let the functions to be called and behind the scene no email will be sent
},
send(){
// no email object will be sent out here. we only test the functionality
}}