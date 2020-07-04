const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

sendWelcomeEmail = (email, name) => {
	if (process.env.SEND_EMAIL === 'true') {
		sgMail.send({
			to: email,
			from: process.env.FROM_EMAIL,
			subject: `Welcome to ${process.env.APP_NAME}`,
			text: 'Hi ' + name + '.\nThanks for joining in!'
		})
	}
}

sendCancellationEmail = (email, name) => {
	if (process.env.SEND_EMAIL === 'true') {
		sgMail.send({
			to: email,
			from: process.env.FROM_EMAIL,
			subject: `Thanks for using ${process.env.APP_NAME}`,
			text: 'Hi ' + name + '.\nYour account has been deleted.\nIs there something we could do to improve our service?'
		})
	}
}
module.exports = {
	sendWelcomeEmail,
	sendCancellationEmail
}