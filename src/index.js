const express = require('express')
const app = express()
const port = process.env.PORT
require('./db/mongoose')
const userRouter=require('./routers/userRouter')
const taskRouter=require('./routers/taskRouter')
app.use(express.json())

//MAINTENANCE MODE
// app.use((req,res,next)=>{
//     console.log(process.env)
//     if(process.env.maintenanceMode==='true')
//     res.status(503).send('Website Temporarily down')
//     else
//     next();
// })
app.use(userRouter)
app.use(taskRouter)



app.listen(port, () => {
    console.log('Server listening on port: ' + port)
})