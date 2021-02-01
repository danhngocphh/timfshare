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

const topLinks = mongoose.model('tops', schematopLink);
const Values = mongoose.model('keysearches', schemaValue);
const Links = mongoose.model('links', schemaLink);

module.exports = {
    topLinks,
    Values,
    Links,
    sendVal: function (val, date) {
        var request = new Values({ value: val, date: date });
        request.save((err, result) => {
            if (err) {
                console.log(err);
                // res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
                return 
            }
            statsd.increment('creations');
            // res.status(201).send(JSON.stringify({ status: "ok", value: result["value"], id: result["_id"] }));
        });
    },
    sendLink: function (val, link, title, date, res) {
        var request = new Links({ value: val, link: link, title: title, date: date });
        request.save((err, result) => {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ status: "error", value: "Error, db request failed" }));
                return
            }
            statsd.increment('creations');
            res.status(201).send(JSON.stringify({ status: "ok", value: result["value"], id: result["_id"] }));
        });
    },
};

