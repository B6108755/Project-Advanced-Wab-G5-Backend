const expressFunction = require('express')
const expressApp = expressFunction()

const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/cpesut';
const config = {
    autoIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology : true
}

var Schema = require('mongoose').Schema


const eventSchema = Schema({
    title : String,
    body : String,
    file : String,
    img : String,
    urllink : String
}, {
    collection : 'eventdata'
})

let Events;

try {
    Events = mongoose.model('eventdata')
} catch (error) {
    Events = mongoose.model('eventdata', eventSchema)
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


const getEvent = () => {
    return new Promise((resolve, reject) => {
        Events.find({} , (err, data) => {
            if(err){
                reject(new Error('Cannot get Data'))
            }else{
                if(data){
                    resolve(data)
                }else{
                    reject(new Error('Cannot get Data'))
                }
            }
        })
    })
}


expressApp.get('/event/get' , (req, res) => {
    getEvent()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(404).json({message: 'Not Found'})
    })
})


const addEvent = (eventData) => {
    return new Promise((resolve, reject) => {
        var new_event = new Events(
            eventData
        )
        new_event.save((err, data) => {
            if(err){
                reject(new Error('Cannot insert Event'))
            }else{
                resolve({message : 'Successfully'})
            }
        })
    })
}


expressApp.post('/event/add' , (req, res) => {
    addEvent(req.body)
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        res.status(400).json({message : 'Cannot insert Event'})
    })
})





expressApp.listen(3000, () =>{
    console.log('Lisitening on port 3000')
})