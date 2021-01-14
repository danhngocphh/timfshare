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
router.get('/', async function (req, res, next) {

      // var toplink = {};
      // var topkey = {};
      var keysearch = [];


      // await Links.aggregate([
      //   { $group: { _id: '$link',title : { $first:  "$title" }, i_total: { $sum: 1 }}},
      //   { $project: { _id: 1, i_total: 1, title: 1 }},
      //   { $sort: { i_total: -1 } },
      //   { $limit : 10 }
      // ]).
      // then(function (result) {
        
      //   for (let i in result) {
           
      //           let val = result[i];    

      //           toplink[val["_id"]] = [val["_id"], val["i_total"],val["title"]];
                
                
           
      //   }
        
      // });

      // await Values.aggregate([
      //   { $match : { value : { $gt:  Date('2021-01-18T18:23:37.000Z'), $lt: Date('2021-01-18T18:23:37.000Z')} } },
      //   { $group: { _id: '$value', i_total: { $sum: 1 }}},
      //   { $project: { _id: 1, i_total: 1, title: 1 }},
      //   { $sort: { i_total: -1 } },
      //   { $limit : 10 }
      // ]).
      // then(function (result) {
        
      //   for (let i in result) {
           
      //           let val = result[i];    

      //           topkey[val["_id"]] = [val["_id"], val["i_total"]];
                
                
           
      //   }
        
      // });

      await Values.aggregate([
        { $group: { _id: '$value'}},
        { $project: { _id: 1}}
        
      ]).
      then(function (result) {
        
        
        for (let i in result) {
           
                let val = result[i]; 
                
                keysearch.push(val["_id"]);

                
                
                
           
        }
        
        
      });



  res.render('index', { title: 'Fshare Search' ,keysearch: keysearch });
});

router.get('/search', (req, res, next) => {


  const { q, gettopkey,gettoplink, start, num } = req.query;
  console.log(q,gettopkey, start, gettoplink, num);


  switch (gettopkey) {
    case null:
      var dategte = new Date("2020-12-06T07:30:19.063Z");
      var datelt = new  Date("2021-01-14T07:30:19.063Z");
      break;
    case 'all':
      var dategte = new Date("2020-12-06T07:30:19.063Z");
      var datelt = new  Date("2021-01-14T07:30:19.063Z");
      break;
    case "month":
      var dategte = new Date("2021-01-01T07:30:19.063Z");
      var datelt = new  Date("2021-01-31T07:30:19.063Z");
      break;
    case "week":
      var dategte = new Date("2021-01-11T07:30:19.063Z");
      var datelt = new  Date("2021-01-13T07:30:19.063Z");
        break;
    default:
      var dategte = new Date("2020-12-06T07:30:19.063Z");
      var datelt = new  Date("2021-01-14T07:30:19.063Z");
  }


  switch (gettoplink) {
    case null:
      var dategtelink = new Date("2020-12-06T07:30:19.063Z");
      var dateltlink = new  Date("2021-01-14T07:30:19.063Z");
      break;
    case 'all':
      var dategtelink = new Date("2020-12-06T07:30:19.063Z");
      var dateltlink = new  Date("2021-01-14T07:30:19.063Z");
      break;
    case "month":
      var dategtelink = new Date("2021-01-01T07:30:19.063Z");
      var dateltlink = new  Date("2021-01-31T07:30:19.063Z");
      break;
    case "week":
      var dategtelink = new Date("2021-01-11T07:30:19.063Z");
      var dateltlink = new  Date("2021-01-13T07:30:19.063Z");
        break;
    default:
      var dategtelink = new Date("2020-12-06T07:30:19.063Z");
      var dateltlink = new  Date("2021-01-14T07:30:19.063Z");
  }

  // if(gettopkey == null || gettopkey == 'all'){
  //   var dategte = new Date("2020-12-06T07:30:19.063Z");
  //   var datelt = new  Date("2021-01-14T07:30:19.063Z");
  // }else if(gettopkey == 'month'){
  //   var dategte = new Date("2021-01-01T07:30:19.063Z");
  //   var datelt = new  Date("2021-01-31T07:30:19.063Z");

  // }else{
  //   var dategte = new Date("2021-01-11T07:30:19.063Z");
  //   var datelt = new  Date("2021-01-13T07:30:19.063Z");

  // }

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
        { $match : {date:  {$gte: dategtelink, $lt: dateltlink}}},
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
        { $match : {date:  {$gte: dategte, $lt: datelt}}},
        { $group: { _id: '$value',date : { $first:  "$date" },  i_total: { $sum: 1 }}},
        { $project: { _id: 1, i_total: 1, date: 1}},
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
