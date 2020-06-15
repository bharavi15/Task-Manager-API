const express = require('express')
const app = express()
require('./db/mongoose')
const userRouter=require('./routers/userRouter')
const taskRouter=require('./routers/taskRouter')
app.use(express.json())

//MAINTENANCE MODE
app.use((req,res,next)=>{
    if(process.env.MAINTENANCE_MODE==='true')
    res.status(503).send('Website Temporarily down')
    else
    next();
})
app.use(userRouter)
app.use(taskRouter)

module.exports = app