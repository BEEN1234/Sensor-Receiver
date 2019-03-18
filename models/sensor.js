const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const SensorSchema = new mongoose.Schema({
    name: String, //user?
    id: String,
    bin: String,
    cable: String,
    reads: [{
        read: Number,
        time: {
            type: Date, 
            default: Date.now
        }
    }],
    userInput: {
        ara: Number
    } //maybe to the user?
});

module.exports = mongoose.model('Sensors', SensorSchema);