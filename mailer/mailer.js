const nodemailer = require('nodemailer')

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'heather18@ethereal.email',
        pass: 'yQ5MJuGJ97xqAXqRrV'
    }
}

module.exports = nodemailer.createTransport(mailConfig)
