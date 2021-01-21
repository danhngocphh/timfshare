var express = require('express');
const { google } = require('googleapis');
const config = require('../config');
var request = require('request');
const mongoose = require('mongoose');
var fs = require('fs');
var convert = require('xml-js');

// var parser = require('xml2json');
// var statsd = require('./statsd');

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
    { $group: { _id: '$value' } },
    { $project: { _id: 1 } }

  ]).
    then(function (result) {


      for (let i in result) {

        let val = result[i];

        keysearch.push(val["_id"]);





      }


    });



  res.render('index', { title: 'Fshare Search', keysearch: keysearch });
});

router.get('/search', (req, res, next) => {

  const { q, gettopkey, gettoplink, start, num } = req.query;

  console.log(q, gettopkey, start, gettoplink, num);
  var namekeylink = "";
  var nametoplink = "";


  switch (gettopkey) {
    case null:
      var dategte = new Date("2020-12-06T07:30:19.063Z");
      var datelt = new Date("2021-01-14T07:30:19.063Z");
      namekeylink = "topkeyall";

      break;
    case 'all':
      var dategte = new Date("2020-12-06T07:30:19.063Z");
      var datelt = new Date("2021-01-14T07:30:19.063Z");
      namekeylink = "topkeyall";
      break;
    case "month":
      var dategte = new Date("2021-01-01T07:30:19.063Z");
      var datelt = new Date("2021-01-31T07:30:19.063Z");
      namekeylink = "topkeymonth";
      break;
    case "year":
      var dategte = new Date("2021-01-01T07:30:19.063Z");
      var datelt = new Date("2021-01-31T07:30:19.063Z");
      namekeylink = "topkeyyear";
      break;
    case "week":
      var dategte = new Date("2021-01-17T07:30:19.063Z");
      var datelt = new Date("2021-01-25T07:30:19.063Z");
      namekeylink = "topkeyweek";
      break;
    default:
      var dategte = new Date("2020-12-06T07:30:19.063Z");
      var datelt = new Date("2021-01-14T07:30:19.063Z");
      namekeylink = "topkeyall";
  }


  switch (gettoplink) {
    case null:
      var dategtelink = new Date("2020-12-06T07:30:19.063Z");
      var dateltlink = new Date("2021-01-14T07:30:19.063Z");
      nametoplink = "toplinkall";
      break;
    case 'all':
      var dategtelink = new Date("2020-12-06T07:30:19.063Z");
      var dateltlink = new Date("2021-01-14T07:30:19.063Z");
      nametoplink = "toplinkall";
      break;
    case "month":
      var dategtelink = new Date("2021-01-01T07:30:19.063Z");
      var dateltlink = new Date("2021-01-31T07:30:19.063Z");
      nametoplink = "toplinkmonth";
      break;
    case "week":
      var dategtelink = new Date("2021-01-17T07:30:19.063Z");
      var dateltlink = new Date("2021-01-25T07:30:19.063Z");
      nametoplink = "toplinkweek";
      break;
    case "year":
      var dategtelink = new Date("2020-12-06T07:30:19.063Z");
      var dateltlink = new Date("2021-12-06T07:30:19.063Z");
      nametoplink = "toplinkyear";
      break;
    default:
      var dategtelink = new Date("2020-12-06T07:30:19.063Z");
      var dateltlink = new Date("2021-01-14T07:30:19.063Z");
      nametoplink = "toplinkall";
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

  // siterestrict
  customsearch.cse.siterestrict.list({
    auth: config.ggApiKey,
    cx: config.ggCx,
    q, start, num
  })
    .then(result => result.data)
    .then(async (result) => {

      var { queries, items, searchInformation } = result;
      var itemsfinal = [];
      var itemsfshare = [];
      // var itemsfshare2 = [];
      const page = (queries.request || [])[0] || {};
      const previousPage = (queries.previousPage || [])[0] || {};
      const nextPage = (queries.nextPage || [])[0] || {};
      var toplink = [];
      var topkey = [];
      var topKeyStorageTmp = [];
      var topLinkStorageTmp = [];

     

      const datas = await requestPromise('https://thuvienhd.com/?feed=rss&search=' + q);

      var result11 = JSON.parse(convert.xml2json(datas, {compact: true, spaces: 4}));

      if(result11.rss.channel.item)
      {
        if(page.startIndex==1)
        {
          itemsfshare.push(...result11.rss.channel.item);
        let itemstest = itemsfshare.map(o => ({



          link: o.link.link._attributes.url,
          title: o.title._text,
          snippet: o.description._cdata.substr( 0, 200) + "..."
        }))

        console.log(itemstest)

          itemsfinal.push(...itemstest);

        }
        

      }
      
      // itemsfshare2.push(JSON.parse(result11).rss.channel.item);
      

    //   fs.readFile( 'https://thuvienhd.com/?feed=rss&search=Vệ%20Binh%20Dải%20Ngân%20Hà', function(err, data) {
        
    //     console.log("to json ->", data);
    //  });

    // console.log(fs.readFileSync('https://thuvienhd.com/?feed=rss&search=Vệ%20Binh%20Dải%20Ngân%20Hà', {encoding: 'utf-8'})); 

      // let result1 = JSON.parse(datas);

      // console.log(result1);


     

      // eqruest('https://thuvienhd.com/?feed=fsharejson&search=123', await function (error, response, body) {

      //   let result = JSON.parse(body);

      //   let itemstest = result.map(o => ({



      //     link: o.title,
      //     title: o.title,
      //     snippet: o.title
      //   }))

      //   itemsfinal.push(...itemstest);


      //   console.log(itemsfinal);
      // });

      

      // itemsfinal = [
      //   {
      //     kind: 'customsearch#result',
      //     title: 'Hí lô ae :)))))',
      //     htmlTitle: '[Thúy Nga|ISO|PBN <b>123</b>] Paris by Night <b>123</b>: Ảo Ảnh 2017 Blu-ray ...',
      //     link: 'http://www.hdvietnam.com/threads/thuy-nga-iso-pbn-123-paris-by-night-123-ao-anh-2017-blu-ray-avc-1080i-dd2-0-ao-anh-2017.1352269/',
      //     displayLink: 'www.hdvietnam.com',
      //     snippet: '1 Tháng Mười Hai 2017 ... Paris by Night 123: Ảo Ảnh 2017 Blu-ray AVC 1080i DD2.0 - ẢO ẢNH 2017 [IMG] \n' +
      //       'Disc Title: PBN123_Bluray Disc Size: 48.446.807.644...',
      //     htmlSnippet: '1 Tháng Mười Hai 2017 <b>...</b> Paris by Night <b>123</b>: Ảo Ảnh 2017 Blu-ray AVC 1080i DD2.0 - ẢO ẢNH 2017 [IMG] <br>\n' +
      //       'Disc Title: PBN123_Bluray Disc Size: 48.446.807.644...',
      //     cacheId: 'begW43Q17asJ',
      //     formattedUrl: 'www.hdvietnam.com/.../thuy-nga-iso-pbn-123-paris-by-night-123-ao-anh- 2017-blu-ray-avc-1080i-dd2-0-ao-anh-2017.1352269/',
      //     htmlFormattedUrl: 'www.hdvietnam.com/.../thuy-nga-iso-pbn-<b>123</b>-paris-by-night-<b>123</b>-ao-anh- 2017-blu-ray-avc-1080i-dd2-0-ao-anh-2017.1352269/',

      //   }
      // ]

      itemsfinal.push(...items);
      // console.log(items);


      // console.log(itemsfinal);

      



      await topLinks.findOne({ name: namekeylink }, {}).
        then(function (result) {



          for (let i in result.value) {

            let val = result.value[i];

            topkey[i] = [val.keyword, val.search_total, val.position, i];


          }

          selectionSortkey(topkey);

          // let dateT = new Date(Date.now());
          // dateT.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
          // options = {

          //   uri: 'http://localhost:1239/toplinks',
          //   method: 'POST',
          //   json: {
          //     "name": nametoplink,
          //     "date": dateT,
          //     "value": topLinkStorageTmp
          //   }
          // };

          // request(options, function (error, response, body) {
          //   if (!error && response.statusCode == 200) {
          //     console.log(body.id) // Print the shortened url.
          //   }
          // });




        });


      await topLinks.findOne({ name: nametoplink }, {}).
        then(function (result) {



          for (let i in result.value) {

            let link = result.value[i];

            toplink[i] = [link.link, link.search_total, link.title, link.position, i];
            // let posTmp = parseInt(i) + 1;
            // topLinkStorageTmp[parseInt(i)] = {'position' : posTmp, 'link': link.link, 'title': link.title , 'search_total' : link.search_total}

          }

          selectionSort(toplink);

          // let dateT = new Date(Date.now());
          // dateT.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
          // options = {

          //   uri: 'http://localhost:1239/toplinks',
          //   method: 'POST',
          //   json: {
          //     "name": "topkeyyear",
          //     "date": dateT,
          //     "value": topLinkStorageTmp
          //   }
          // };

          // request(options, function (error, response, body) {
          //   if (!error && response.statusCode == 200) {
          //     console.log(body.id) // Print the shortened url.
          //   }
          // });




        });

      // await Values.aggregate([
      //   { $match : {date:  {$gte: dategte, $lt: datelt}}},
      //   { $group: { _id: '$value',date : { $first:  "$date" },  i_total: { $sum: 1 }}},
      //   { $project: { _id: 1, i_total: 1, date: 1}},
      //   { $sort: { i_total: -1 } },
      //   { $limit : 10 }
      // ]).
      // then(function (result) {

      //   topKeyStorageTmp = topKeyStorageTmp.splice(0); 
      //   for (let i in result) {

      //           let val = result[i];    

      //           topkey[i] = [val["_id"], val["i_total"]];
      //           let posTmp = parseInt(i) + 1;
      //           topKeyStorageTmp[parseInt(i)] = {'position' : posTmp, 'keyword': val["_id"], 'search_total' : val["i_total"]}


      //   }

      //   // let dateT = new Date(Date.now());
      //   // dateT.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
      //   // options = {

      //   //   uri: 'http://localhost:1239/toplinks',
      //   //   method: 'POST',
      //   //   json: {
      //   //     "name": namekeylink,
      //   //     "date": dateT,
      //   //     "value": topKeyStorageTmp
      //   //   }
      //   // };

      //   // request(options, function (error, response, body) {
      //   //   if (!error && response.statusCode == 200) {
      //   //     console.log(body.id) // Print the shortened url.
      //   //   }
      //   // });


      // });



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
        items: itemsfinal.map(o => ({
          link: o.link,
          title: o.title,
          snippet: o.snippet
        }))
      }

      console.log("endddd");




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
