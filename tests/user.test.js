const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const mongoose= require('mongoose')
const jwt = require('jsonwebtoken')

const userOneId= new mongoose.Types.ObjectId()
const userOne={
    _id:userOneId,
    name:'goku',
    email:'asdfkjasdfaskdf@gmail.com',
    password:'1bcd123',
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET_KEY)
    }]
}

const userTwoId= new mongoose.Types.ObjectId()
const userTwo={
    _id:userTwoId,
    name:'goku',
    email:'gokulakhote123324@gmail.com',
    password:'1bcd123',
    tokens:[{
        token:jwt.sign({_id:userTwoId},process.env.JWT_SECRET_KEY)
    }]
}

beforeEach(async()=>{
    console.log('global before each')
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should test maintainence mode',async ()=>{
    process.env.MAINTENANCE_MODE = 'true'
    await request(app)
        .get('/')
        .send()
        .expect(503)
    process.env.MAINTENANCE_MODE = 'false'
})
describe('Check emails are working',()=>{
    beforeEach(async ()=>{
    console.log('describe before all')
    process.env.SEND_EMAIL='true'
    await User.deleteMany()
    await new User(userTwo).save()
    })
    test('Should signup a new user and Send Welcome email', async ()=>{
        await request(app)
                .post('/api/users')
                .send({
                    name:'Bharavi',
                    email:'bharavi15@gmail.com',
                    password:'abcd1234'
                }).expect(201)
    })

   
    test('Should delete User Profile for Authorized user and Send Cancellation Email', async()=>{
        console.log('delete user')
        await request(app)
            .delete('/api/users/me')
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .expect(200)
    })

    afterAll(()=>{
        console.log('describe after all')
        process.env.SEND_EMAIL='false'
    })
})


test('Should login existing user', async ()=>{
    await request(app)
            .post('/api/users/login')
            .send({
                email:userOne.email,
                password:userOne.password
            }).expect(200)

})

test('Should not login non-existing user', async ()=>{
    await request(app)
            .post('/api/users/login')
            .send({
                email:'a@b.com',
                password:'myPass123'
            }).expect(400)

})
test('Should get User Profile', async()=>{
    await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(200)

})

test('Should not get User Profile for unauthorized user', async()=>{
    await request(app)
            .get('/api/users/me')
            .expect(401)
})

test('Should not delete User Profile for unauthorized user', async()=>{
    await request(app)
            .delete('/api/users/me')
            .expect(401)
})

test('Should delete User Profile for Authorized user', async()=>{
    await request(app)
            .delete('/api/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(200)
})


