const router = require('express').Router()
const User = require('../models/User')
const nodemailer = require("nodemailer");

const CLIENT_ID = "977290837374-aub2k2t0imad688mkrq96ffi29qmokso.apps.googleusercontent.com"
const CLIENT_SECRET = ''
const ACCESS_TOKEN = 'ya29.a0Aa4xrXNTfdGWcEKtxb8hsNHKsbHn72U5hfl-LaXfF7ruDHM6MdJ8MEM0gwvl5jVYx2O4gYX9TL1PdwMTFrlbOKJgh1Ti2XJP52-WROvP2j0EnxEnDdbKSgvt6y7wKOD4ufMI1NL3GOyqe93UhjbTLspDH_zxaCgYKATASARASFQEjDvL9VKtlglcY5HJorkCsAx2s0Q0163'

router.get('/', (req, res) => {
    User.find().then(users => {
        res.status(200).json(users)
    }).catch(err =>{
        res.status(500).json({error: err.message})
    })
})

router.post('/register', async (req, res) => {
    console.log('test', await userExists(req.body.email))
    if(await userExists(req.body.email)){
        res.status(409).json({error: 'Email already exists'})
    }else {
        const newUser = new User(req.body)
        newUser.save().then(user => {
            res.status(201).json(user)
        }).catch(err => {
            res.status(500).json({error: err.message})
        })
    }
})

router.post('/login', (req, res) => {
    User.findOne({email: req.body.email, password: req.body.password})
    .then(user => {

        if(user){
            res.status(200).json(user)
        } else {
            res.status(401).json({error: 'Incorrect email or password'})
        }

    }).catch(err => {
        res.status(500).json({error: err.message})
    })
})

router.post('/recovery', async (req, res) => {
        
        if( await userExists(req.body.email)){
            const user = await User.findOne({email: req.body.email.toLowerCase().trim()})
            res.status(200).json({success: "EMAIL ENVIADO!!"})
            sendEmail(req.body.email, user.password)
        } else {
            res.status(401).json({error: 'Email incorrecto!'})
        }
})

function sendEmail(userEmail, userPass) {
    try {

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAUTH2',
                user: 'registerappduoc@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                accessToken: ACCESS_TOKEN
            }
        })

        const mailOptions = {
            from: 'registerappduoc@gmail.com',
            to: userEmail,
            subject: 'Restablecer contraseña',
            text: 'Esta es tu contraseña!!',
            html: '<p>Restablecer Contraseña, esta es tu contraseña!!<p>' +  userPass
        }

        const result = transport.sendMail(mailOptions)

        return result
        
    } catch (error) {
        return error
    }
}

const userExists = async (email) => {
   const user = await User.findOne({email: email.toLowerCase().trim()})

   if(user){
    return true
   } else {
    return false
   }
}





module.exports = router