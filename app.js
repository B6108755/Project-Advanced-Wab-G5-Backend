const expressFunctions = require('express')
const mongoose = require('mongoose')
var expressApp = expressFunctions();

const url = 'mongodb://localhost:27017/club';
const config = {
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
var Schema = require('mongoose').Schema;
const userSchema = Schema({
    title: String,
    firstname: String,
    lastname: String,
    sid: String,
    major: String,
    facebook: String,
    tell: String,
    file: String,
    img: String,
}, { collection: 'members' });
let member
try {
    Member = mongoose.model('Members')
} catch (error) {
    Member = mongoose.model('Members', userSchema)
}
expressApp.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELECT, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Option,Authorization')
    return next();
});
expressApp.use(expressFunctions.json());
expressApp.use((req, res, next) => {
    mongoose.connect(url, config)
        .then(() => {
            console.log('Connected to MogoDB...');
            next();
        })
        .catch(err => {
            console.log('Cannot connect to MogoDB...');
            res.status(500).send('Cannot connect to MogoDB')
        });
});
const addMember = (memberData) => {
    return new Promise((resolve, reject) => {
        var new_member = new Member(memberData);
        new_member.save((err, data) => {
            if (err) {
                reject(new Error('Cannot insert member to DB!'))
            } else {
                resolve({ message: 'Member added successfully' })
            }
        });
    });
}
const getmembers = () => {
    return new Promise((resolve, reject) => {
        Member.find({}, (err, data) => {
            if (err) {
                reject(new Error('Cannot get members!'))
            } else {
                if (data) {
                    resolve(data);
                } else {
                    reject(new Error('Cannot get members!'))
                }
            }
        })
    })
}
expressApp.post('/members/add', (req, res) => {
    console.log('add');
    addMember(req.body)
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
        })
});
expressApp.get('/members/get', (req, res) => {
    console.log('get');
    getmembers()
        .then(result => {
            console.log(result);
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err);
        })
})

expressApp.listen(3000, function() {
    console.log('Listening on port 3000');
})