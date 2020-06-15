const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer=require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail,sendCancellationEmail} = require('../emails/account')
router.post('/users', async (req, res, next) => {
    console.log(req.body);
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        sendWelcomeEmail(user.email,user.name)
        res.status(201).send({user,token})
    } catch (error) {
        res.status(400).send(error)
    }
})
router.post('/users/login', async (req, res, next) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken()
        res.send({
            user,
            token
        })
    } catch (error) {
        res.status(400).send()
    }

})

router.post('/users/logout',auth, async(req,res,next)=>{
    try{
        req.user.tokens= req.user.tokens.filter((token)=> token.token!==req.token)
        await req.user.save()
        res.send()
    }catch(error){
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth, async(req,res,next)=>{
    try{
        req.user.tokens= []
        await req.user.save()
        res.send()
    }catch(error){
        res.status(500).send()
    }
})

router.get('/users/me', auth ,async (req, res) => {
    try {
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})


router.patch('/users/me', auth ,async (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid field present'
        });
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth ,async (req, res, next) => {
    try {
        await req.user.remove()
        sendCancellationEmail(req.user.email,req.user.name)
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send(error)
    }
})


const upload=multer({
    limits:{
        fileSize:3000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
           return cb(new Error('Filetype is not jpg/jpeg/png'))
        }
        cb(null,true);
    }
})

router.post('/users/me/avatar',auth, upload.single('avatar'),async (req,res,next)=>{
    const buffer= await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,async (req,res,next)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.get('/users/:id/avatar',async(req,res,next)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png').send(user.avatar)
    }catch(error){
        res.status(404).send()
    }
    
})
module.exports = router