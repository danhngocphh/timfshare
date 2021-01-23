var express = require('express');
const { google } = require('googleapis');
const config = require('../config');
var request = require('request');
const mongoose = require('mongoose');
var fs = require('fs');

const requestPromise = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        reject(error);
      }
      resolve(body);
    })
  })
}


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

var schematopLink = mongoose.Schema({
  name: String,
  date: Date,
  value: Object
});
var topLinks = mongoose.model('top', schematopLink);

mongoose.connect("mongodb+srv://vegarnom:vegar8226@cluster0.eotns.mongodb.net/dbda1?retryWrites=true&w=majority", { useNewUrlParser: true });





var options;

var router = express.Router();
const customsearch = google.customsearch('v1');



/* GET home page. */
router.get('/', async function (req, res, next) {

        var toplink = [];
        var topkey = [];
        var keysearch = [];


          await topLinks.findOne({ name: "topkeyall" }, {}).
          then(result => {
            for (let i in result.value) {

              let val = result.value[i];

              topkey[i] = [val.keyword, val.search_total, val.position, i];
            }
            selectionSortkey(topkey);
           });

        await topLinks.findOne({ name: "toplinkall" }, {}).
              then( result => {

                for (let i in result.value) {

                  let link = result.value[i];

                  toplink[i] = [link.link, link.search_total, link.title, link.position, i];

                }
                selectionSort(toplink);
              });

        await Values.aggregate([
          { $group: { _id: '$value'}},
          { $project: { _id: 1}}
        ]).then( result => {
          for (let i in result) {
                  let val = result[i];   
                  keysearch[i] = val["_id"];
        }
          
        });
        res.render('index', { title: 'Fshare Search', keysearch,  topkey, toplink });
});



router.get('/search', (req, res, next) => {

  const { q, gettopkey, gettoplink, start, num } = req.query;

  console.log(q, gettopkey, start, gettoplink, num);
                                  var namekeylink = "";
  var nametoplink = "";


  switch (gettopkey) {
    case null:
      namekeylink = "topkeyall";
      break;
    case 'all':
     namekeylink = "topkeyall";
      break;
    case "month":
      namekeylink = "topkeymonth";
      break;
    case "year":
      namekeylink = "topkeyyear";
      break;
    case "week":
      namekeylink = "topkeyweek";
      break;
    default:
      namekeylink = "topkeyall";
  }


  switch (gettoplink) {
    case null:
      nametoplink = "toplinkall";
      break;
    case 'all':
      nametoplink = "toplinkall";
      break;
    case "month":
      nametoplink = "toplinkmonth";
      break;
    case "week":
      nametoplink = "toplinkweek";
      break;
    case "year":
      nametoplink = "toplinkyear";
      break;
    default:
      nametoplink = "toplinkall";
  }

  customsearch.cse.list({
    auth: config.ggApiKey,
    cx: config.ggCx,
    q, start, num
  })
    .then(result => result.data)
    .then(async (result) => {

      var { queries, items, searchInformation } = result;

      var itemsfinal = [];
      const page = (queries.request || [])[0] || {};
      const previousPage = (queries.previousPage || [])[0] || {};
      const nextPage = (queries.nextPage || [])[0] || {};
      var toplink = [];
      var topkey = [];
      const keysearchurl = q.toString().split(' ', 3)
      var keyfshare = q;
      var locksearch = 0;


      switch(keysearchurl[0]) {
        case "inurl:hdvietnam":
            locksearch = 1;
          break;
        case "inurl:fshare":
          keyfshare = q.toString().substr(13)
          break;
        case "inurl:thuvienhd":
          keyfshare = q.toString().substr(16)
          break;
        default:
          // code block
      }


      if(page.startIndex == 1 && locksearch != 1){

        const datas = await requestPromise('https://thuvienhd.com/?feed=fsharejson&search=' + keyfshare);
        let result1 = JSON.parse(datas);
        result1.forEach(function(value, index){
          if(value.links.length == 0){
            result1.splice(index, 1);
          }
        });
        let itemstest = result1.map(o => ({
            link: o.links[0].link,
            title: o.title,
            snippet: o.links[0].title
          })) 
        itemsfinal.push(...itemstest);
        }


      itemsfinal.push(...items);

      await topLinks.findOne({ name: namekeylink }, {}).
        then(function (result) {



          for (let i in result.value) {

            let val = result.value[i];

            topkey[i] = [val.keyword, val.search_total, val.position, i];


          }

          selectionSortkey(topkey);

        });


      await topLinks.findOne({ name: nametoplink }, {}).
        then(function (result) {



          for (let i in result.value) {

            let link = result.value[i];

            toplink[i] = [link.link, link.search_total, link.title, link.position, i];

          }

          selectionSort(toplink);

        });

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
        items: itemsfinal.map(o => ({
          link: o.link,
          title: o.title,
          snippet: o.snippet
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

router.get('/listtop', async (req, res, next) => {

  const { nametoplink, nametopkey } = req.query;

  console.log(req.query);

  let toplink = [];
  let topkey = [];

  await topLinks.findOne({ name: nametopkey }, {}).
          then(result => {
            for (let i in result.value) {

              let val = result.value[i];

              topkey[i] = [val.keyword, val.search_total, val.position, i];
            }
            selectionSortkey(topkey);
           });

  await topLinks.findOne({ name: nametoplink }, {}).
              then( result => {

                for (let i in result.value) {

                  let link = result.value[i];

                  toplink[i] = [link.link, link.search_total, link.title, link.position, i];

                }
                selectionSort(toplink);
              });

  const data = {
        toplink: toplink,
        topkey: topkey,
  }

  console.log(data)

      // res.status(200).send(result);
  res.status(200).send(data);    
})

function selectionSort(array) {
  for (let i = 0; i < array.length - 1; i++) {
    let idmin = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j][3] < array[idmin][3]) idmin = j;
    }

    // swap
    let t = array[i];
    array[i] = array[idmin];
    array[idmin] = t;
  }
}

function selectionSortkey(array) {
  for (let i = 0; i < array.length - 1; i++) {
    let idmin = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j][2] < array[idmin][2]) idmin = j;
    }

    // swap
    let t = array[i];
    array[i] = array[idmin];
    array[idmin] = t;
  }
}


module.exports = router;
