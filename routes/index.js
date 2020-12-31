var express = require('express');
const { google } = require('googleapis');
const config = require('../config');
var request = require('request');
const mongoose = require('mongoose');
// var statsd = require('./statsd');


const schemaValue = mongoose.Schema({
        value: String,
        date: Date,
        count: Number
    });
const Values = mongoose.model('keysearches', schemaValue);

const schemaLink = mongoose.Schema({
    value: String,
    link: String,
    title: String,
    date: Date,
    count: Number
});
const Links = mongoose.model('links', schemaLink);

mongoose.connect("mongodb+srv://vegarnom:vegar8226@cluster0.eotns.mongodb.net/dbda1?retryWrites=true&w=majority",{useNewUrlParser: true});





var options;

var router = express.Router();
const customsearch = google.customsearch('v1');



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Fshare Search' });
});

router.get('/search', (req, res, next) => {


  const { q, start, num } = req.query;
  console.log(q, start, num);

  customsearch.cse.list({
    auth: config.ggApiKey,
    cx: config.ggCx,
    q, start, num
  })
    .then(result => result.data)
    .then( async (result) => {
      const { queries, items, searchInformation } = result;

      const page = (queries.request || [])[0] || {};
      const previousPage = (queries.previousPage || [])[0] || {};
      const nextPage = (queries.nextPage || [])[0] || {};
      var toplink = {};
      var topkey = {};


      await Links.aggregate([
        { $group: { _id: '$link',title : { $first:  "$title" }, i_total: { $sum: 1 }}},
        { $project: { _id: 1, i_total: 1, title: 1 }},
        { $sort: { i_total: -1 } },
        { $limit : 10 }
      ]).
      then(function (result) {
        
        for (let i in result) {
           
                let val = result[i];    

                toplink[val["_id"]] = [val["_id"], val["i_total"],val["title"]];
                
                
           
        }
        
      });

      await Values.aggregate([
        { $group: { _id: '$value', i_total: { $sum: 1 }}},
        { $project: { _id: 1, i_total: 1, title: 1 }},
        { $sort: { i_total: -1 } },
        { $limit : 10 }
      ]).
      then(function (result) {
        
        for (let i in result) {
           
                let val = result[i];    

                topkey[val["_id"]] = [val["_id"], val["i_total"]];
                
                
           
        }
        
      });

      // toplink.set("link", "123");
      

      const data = {
        q,
        totalResults: page.totalResults,
        count: page.count,
        startIndex: page.startIndex,
        nextPage: nextPage.startIndex,
        previousPage: previousPage.startIndex,
        time: searchInformation.searchTime,
        toplink: toplink,
        topkey: topkey,
        items: items.map(o => ({
          link: o.link,
          title: o.title,
          snippet: o.snippet,
          img: (((o.pagemap || {}).cse_image || {})[0] || {}).src
        }))
      }

      


      //send data to localhost:1239
      let dateT = new Date(Date.now());
      dateT.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
      options = {
        
        uri: 'http://fptda1admin.herokuapp.com/values',
        method: 'POST',
        json: {
          "value": data.q,
          "date": dateT
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body.id) // Print the shortened url.
        }
      });
      // res.status(200).send(result);
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
})


module.exports = router;
