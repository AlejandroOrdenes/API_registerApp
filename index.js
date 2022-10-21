require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const port = process.env.PORT || 3000

//ROUTES
const userRoutes = require('./api/UserRoutes')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello world')
})

app.use('/users', userRoutes)

mongoose.connect(process.env.MONGODB,{useUnifiedTopology: true})
.then(() => {

    app.listen(port, () => {
        console.log('app running...')
    })
}).catch(err => console.log(err))