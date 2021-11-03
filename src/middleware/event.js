var expressFunction = require('express')
const router = expressFunction.Router()


const mongoose = require('mongoose')

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

router.route('/get')
    .get( (req, res) => {
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


router.route('/add')
    .post((req, res) => {
        addEvent(req.body)
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(400).json({message : 'Cannot insert Event'})
            })
    })


module.exports = router
    