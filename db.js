var mongoose = require('mongoose');
var statsd = require('./statsd');

mongoose.connect("mongodb+srv://vegarnom:vegar8226@cluster0.eotns.mongodb.net/dbda1?retryWrites=true&w=majority");
// mongoose.connect("mongodb://118.68.170.61:27020/fshare-search");
const connection = mongoose.connection;
connection.on('open', () => console.log('Connected.'));
connection.on('error', () => console.log('Disconnected.'));

const schemaValue = mongoose.Schema({
    value: String,
    date: Date,
    count: Number
});

const schemaLink = mongoose.Schema({
    value: String,
    link: String,
    title: String,
    date: Date,
    count: Number
});

const schematopLink = mongoose.Schema({
    name: String,
    date: Date,
    value: Object
});

module.exports = {
    topLinks: mongoose.model('tops', schematopLink),
    Values: mongoose.model('keysearches', schemaValue),
    Links: mongoose.model('links', schemaLink),
};

