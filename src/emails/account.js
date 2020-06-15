
const sgMail= require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'reminder.taskmanger@gmail.com',
        subject:'Welcome to Task Manager App',
        text:'Hi '+name+'.\nThanks for joining in!'
    })
}

sendCancellationEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'reminder.taskmanger@gmail.com',
        subject:'Thanks for using Task Manager App',
        text:'Hi '+name+'.\nYour account has been deleted.\nIs there something we could do to improve our service?'
    })
}
module.exports ={
    sendWelcomeEmail,
    sendCancellationEmail
}