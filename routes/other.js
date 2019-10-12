const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

//Catering
router.get('/catering',(req, res)=> res.render('catering'));

//about
router.get('/about',(req, res)=> res.render('about'));

//contact
router.get('/contact',(req, res)=> res.render('contact'));

router.post('/contact',(req,res)=>{
const output= `
<p>You have new message</p>
<h3>Details</h3>
<p>Email: ${req.body.customer_email}</p>
<p>Name: ${req.body.name}</p>
<p>Phone Number: ${req.body.phone_number}</p>
<h3>Message</h3>
<p>${req.body.content}</p>
`;
console.log(output)

// async..await is not allowed in global scope, must use a wrapper
async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'bar@example.com, baz@example.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
req.flash('success_msg','Email Sent');
res.render("contact")
});


module.exports = router;
