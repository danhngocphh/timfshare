var express = require('express');
const { google } = require('googleapis');
const config = require('../config');
var request = require('request');




var options;

var router = express.Router();
const customsearch = google.customsearch('v1');



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'CSE Google' });
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
    .then((result) => {
      const { queries, items, searchInformation } = result;

      const page = (queries.request || [])[0] || {};
      const previousPage = (queries.previousPage || [])[0] || {};
      const nextPage = (queries.nextPage || [])[0] || {};

      const data = {
        q,
        totalResults: page.totalResults,
        count: page.count,
        startIndex: page.startIndex,
        nextPage: nextPage.startIndex,
        previousPage: previousPage.startIndex,
        time: searchInformation.searchTime,
        items: items.map(o => ({
          link: o.link,
          title: o.title,
          snippet: o.snippet,
          img: (((o.pagemap || {}).cse_image || {})[0] || {}).src
        }))
      }
      //send data to localhost:1239
      let dateT = new Date(Date.now());
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
