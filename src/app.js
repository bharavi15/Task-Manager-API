const express = require('express')
const app = express()
const path = require('path')
require('./db/mongoose')
const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')
app.use(express.json())
app.use(express.static(path.join(__dirname, '../dist/task-manager')));
//MAINTENANCE MODE
app.use((req,res,next)=>{
	res.setHeader("Access-Control-Allow-Origin","*")
	res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS")
	res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
	next();
})
app.use((req, res, next) => {
    if (process.env.MAINTENANCE_MODE === 'true')
        res.status(503).send('Website Temporarily down')
    else
        next();
})
app.use('/api',userRouter)
app.use('/api',taskRouter)

module.exports = app