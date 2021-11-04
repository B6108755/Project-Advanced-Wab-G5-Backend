const expressFunction = require('express')
const expressApp = expressFunction()
const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017/cpesut';
const config = {
    autoIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology : true
}


expressApp.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin' , 'http://localhost:4200')
    res.setHeader('Access-Control-Allow-Methods' , 'POST, GET, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers' , 'Content-Type, Option, Authorization')
    return next()
})

expressApp.use(expressFunction.json());

expressApp.use((req, res, next) =>{
    mongoose.connect(url,config)
    .then(() => {
        console.log('Connected to MongoDB...')
        next()
    })
    .catch(err => {
        console.log('Cannot connect to MongoDB')
        res.status(501).send('Cannot connect to MongoDB')
    })
})

//USE Middenware

expressApp.use('/event' , require("./middleware/event"))



expressApp.listen(3000, () =>{
    console.log('Lisitening on port 3000')
})