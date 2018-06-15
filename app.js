const Express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = new Express();

mongoose.connect('mongodb://localhost/newTask', (err) => {
    if(err){
        return console.log('DB not connected');
    }
    return console.log('successfully connected');
})

app.use(bodyParser.json({limit:'20mb'}));
app.use(bodyParser.urlencoded({limit:'20mb', extended: 'false'}));

app.use(Express.static(__dirname + '/public'));

var schema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    comment: {
        type: String,
        required: true
    }
});

var users = mongoose.model('tasks', schema);


app.get('/viewFeedBack', (req, res) => {

    users.find({}, function(err, docs) { 
        res.send(docs);
    }).catch((err) => {
        return res.status(400).send({status: "failed", message: err.message})
    })

});

app.post('postFeedback', (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment
    } 

    var UserSchema = new users(data)

    UserSchema.save().then((data) => {
        return res.send({status: "success", message: "Success", data: data});
    }).catch((err) => {
        return res.status(400).send({status: "failed", message: err.message});
    })

})

app.listen(3000, (err) => {
    if(!err){
        console.log('server connected');    
    }
})