const sgMail = require('@sendgrid/mail') 

const sendgridAPIKey = process.env.SENDGRID_API_KEY

// to actual send this test email, go to terminal and execute this code: node src/emails/account.js
// check the email
sgMail.setApiKey(sendgridAPIKey)
/*sgMail.send({
    to: 'somebody@gmail.com',
    from: 'somebody@gmail.com',
    subject: 'Test Email',
    text: 'I am having fun with node.js.'
})*/

// create a function to send welcome email when user sign up the app
const sendWelcomeEmail = ( email, name ) =>
{ //sgMail.send is async that return a Promise
    sgMail.send({
        to: email,
        from: 'mei3388chin@gmail.com',
        subject: 'Welcome to Task Management app',
        text: `Welcome to the app, ${name}. Let me know how you get along with this app.`
        //html: html tag goes here 
    })
}

// create a function to send cancellation of the user account
const sendCancelationEmail = ( email, name ) =>
{ //sgMail.send is async that return a Promise
    sgMail.send({
        to: email,
        from: 'mei3388chin@gmail.com',
        subject: 'Cancelation to Task Management app',
        text: `We hate to let you go, ${name}. Let us know if you have any suggestion on this app.`
        //html: html tag goes here 
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}




