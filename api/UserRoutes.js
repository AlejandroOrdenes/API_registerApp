const router = require('express').Router()
require('dotenv').config()
const User = require('../models/User')
const Asistencia = require('../models/Asistencia')
let nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
})
transporter.verify().then(console.log).catch(console.error);

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
            sendEMail(req.body.email, user.password)
        } else {
            res.status(401).json({error: 'Email incorrecto!'})
        }
})

router.post('/sendQr', async (req, res) => {
    
    if( await userExists(req.body.userEmail)){
        try {
            const user = await User.findOne({email: req.body.userEmail.toLowerCase().trim()})
            console.log("USER " + user)
            const img = req.body.imgUrl
            console.log("IMAGEN " + img)
            const email = user.email
            console.log("EMAIL USER " + email)
            sendQR(email, img) 
            res.status(200).json({success: "QR ENVIADO!!"})
            console.log("EMAIL EXISTE!!")
        } catch (error) {
            res.status(401).json({error: "No se pudo enviar QR!!"})
            console.log("ERROR SEND EMAIL " + error)
        }
        
    } else {
        res.status(401).json({error: 'Email incorrecto!'})
    }
})

// router.post('/scanner', async (req, res) => {
        
//     if( await userExists(req.body.email)){
//         const user = await User.findOne({email: req.body.email.toLowerCase().trim()})
//         res.status(200).json({success: "EMAIL ENVIADO!!"})
//         sendEMail(req.body.email, user.password)
//     } else {
//         res.status(401).json({error: 'Email incorrecto!'})
//     }

// })



function sendEMail(userEmail, data) {
    try {
            console.log("TYPE RECOVERY")
            const mailOptions = {
                to: userEmail,
                subject: 'Restablecer contraseña',
                text: 'Esta es tu contraseña!!',
                html: '<p>Restablecer Contraseña, esta es tu contraseña!!<p>' +  data
            }
            const result = transporter.sendMail(mailOptions)
            return result
    } catch (error) {
        console.log(error)
        return error
    }
}



async function sendQR(userEmail, data) {
    
    try {
            console.log("TYPE QR")
            const mailOptions = {
                to: userEmail,
                subject: 'Codigo QR',
                text: 'Codigo QR Asistencia',
                html: '<p>Click <a href="blob:http://localhost:8100/ebfa4720-76fb-45c9-8735-6295ccbc0aec">CLICK ME </a> to reset your password</p>'                
            }
            const result = transporter.sendMail(mailOptions)
            return result
    } catch (error) {
        console.log(error)
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