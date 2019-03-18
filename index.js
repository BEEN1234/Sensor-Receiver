const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');
const http = require('http');
const bodyParser = require('body-parser');
// { stringify } = require('flatted');
require('dotenv').config({ path: 'variables.env' });


mongoose.connect(process.env.DATABASE, {useNewUrlParser: true});
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

require('./models/sensor');

const Sensor = mongoose.model('Sensors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', async function(req, res, next) {
    var data = req.body.data;
    var hexBool = false;
    hexBool = validator.isHexadecimal(data);
    if(hexBool){
      var splitter = "28FF";
      var dataArray = data.split(splitter);
      dataArray.shift(); //first element in the array is empty
      var dataPromiseArray = [];
      dataArray.forEach((req) => {
        var id = splitter + req.slice(0, 12);
        var read = req.slice(12, 15);
        read = parseInt(read);
        dataPromiseArray.push(Sensor.findOneAndUpdate({id: id}, {$push: {reads: {read}}}, {upsert: true}));
      });
      // await Promise.all(dataPromiseArray); //dedelme
      res.status(200).send("ok"); //delme
    }
    else{
      res.status(400).send("invalid input");
    }
});

app.get('/', (req, res) => {
    res.send("ok");
});

app.set('port', process.env.PORT);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(app.get('port'), () => {console.log('express running')});