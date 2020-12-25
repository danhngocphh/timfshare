var mongoose = require('mongoose');
var statsd = require('./statsd');


var schemaValue = mongoose.Schema({
        value: String,
        date: Date,
        count: Number
    });
var Values = mongoose.model('keysearches', schemaValue);

var schemaLink = mongoose.Schema({
    value: String,
    link: String,
    title: String,
    date: Date,
    count: Number
});
var Links = mongoose.model('links', schemaLink);



module.exports = {
    connectDB : function() {
        mongoose.connect("mongodb+srv://vegarnom:vegar8226@cluster0.eotns.mongodb.net/dbda1?retryWrites=true&w=majority  ");
    },

    updateGauge : function() {
        Values.count(function(err, result) {
            if(!err) {
                statsd.gauge('values', result);
            }
        })
    },

    getDash :  async function(res) {
        let totalkey = 0;
        let totallink = 0;
        let check;
        let title = '123';
        let values = {};
        let links = {};
        

        await Values.count({}, function( err, count){
                    totalkey = count;
                });
        await Links.count({}, function( err, countlink){
                    totallink = countlink;
                });        

        Values.aggregate([
            { $group: { _id: '$value', i_total: { $sum: 1 }}},
            { $project: { _id: 1, i_total: 1 }},
            { $sort: { i_total: -1 } },
            { $limit : 10 }
          ]).
          then(function (result) {
            
            for (let i in result) {
               
                    let val = result[i];    
                    
                        values[val["_id"]] = [val["_id"], val["i_total"]];
               
            }
            title = process.env.TITLE || 'Fshare demo'
            // [ { maxBalance: 98000 } ]
            Links.aggregate([
                { $group: { _id: '$link', i_total: { $sum: 1 }}},
                { $project: { _id: 1, i_total: 1 }},
                { $sort: { i_total: -1 } },
                { $limit : 10 }
              ]).
              then(function (result) {
                
                for (let i in result) {
                   
                        let val = result[i];    
                        
                            links[val["_id"]] = [val["_id"], val["i_total"]];
                   
                }
                title = process.env.TITLE || 'Fshare demo'
                // [ { maxBalance: 98000 } ]
                res.render('index', {title, links: links, values: values , totalkey: totalkey, totallink: totallink });
                
              });
            
          });

          




          

        //   Links.aggregate([
        //     { $group: { _id: '$link', i_total: { $sum: 1 }}},
        //     { $project: { _id: 1, i_total: 1 }},
        //     { $sort: { i_total: -1 } },
        //     { $limit : 10 }
        //   ]).
        //   then(function (result) {
        //     let values = {};
        //     for (let i in result) {
               
        //             let val = result[i];    
                    
        //                 values[val["_id"]] = [val["_id"], val["i_total"]];
               
        //     }

        //     title = process.env.TITLE || 'Fshare demo'
        //     res.render('index', {title, link: values , totalkey: totalkey, totallink: totallink }); // [ { maxBalance: 98000 } ]
            
        //   });

        // Values.aggregate().
        //     group({ _id: '$value', i_total: { $sum: 1 } }).
        //     exec(function (err, res) {
        //         if (err) return err;
        //         let a = res;
        //         console.log(res); 
        //     });

        // Values.find( async function(err, result) {
            
        //     if (err) {
        //         console.log(err);
        //         res.send('database error');
        //         return
        //     }
          
        //     await Values.count({}, function( err, count){
        //         total = count;
        //     });
            
            
        // });
       
    },

    getValkey :  async function(res) {
        let total = 0;
        let check;
        let title = '';
        let values = {};

        await Values.count({}, function( err, count){
                    total = count;
                });

        Values.aggregate([
            { $group: { _id: '$value', i_total: { $sum: 1 }, date: {$push:'$date'}}},
            { $project: { _id: 1, i_total: 1 }}
          ]).
          then(function (result) {
            for (let i in result) {
               
                    let val = result[i];   
                    let dateT =  getDateT(val["date"]); 
                    let Time = getDateTime(val["date"]);
                    
                        values[val["_id"]] = [val["_id"], Time, dateT, val["i_total"]];
               
            }

            title = process.env.TITLE || 'Fshare demo'
            res.render('table-data-key', {title, values: values , total: total}); // [ { maxBalance: 98000 } ]
            
          });

        // Values.aggregate().
        //     group({ _id: '$value', i_total: { $sum: 1 } }).
        //     exec(function (err, res) {
        //         if (err) return err;
        //         let a = res;
        //         console.log(res); 
        //     });

        // Values.find( async function(err, result) {
            
        //     if (err) {
        //         console.log(err);
        //         res.send('database error');
        //         return
        //     }
          
        //     await Values.count({}, function( err, count){
        //         total = count;
        //     });
            
            
        // });
       
    },

    getVallink :  async function(res) {
        let total = 0;
        let check;
        let title = '';
        let values = {};

        await Links.count({}, function( err, count){
                    total = count;
                });

        Links.aggregate([
            { $match: { 
                "link" : { "$exists" : true}, 
                "title" : { "$exists" : true}
              } 
            },
            { $group: { _id: { "link": "$link", "value":"$value"}  , title : { $first:  "$title" }, value : { $first:  "$value" }, i_total: { $sum: 1 }}},
            { $project: { _id: 1, i_total: 1 , title: 1, value: 1 }}
            
          ]).
          then(function (result) {
            let pos = 1;              
            for (let i in result) {
               
                    let val = result[i]; 
                   
                    
                        values[pos] = [val["_id"]["link"], val["title"] , val["i_total"], val["value"]];
                        pos++;
                    
                    
                        
               
            }

            title = process.env.TITLE || 'Fshare demo'
            res.render('table-data-link', {title, values: values , total: total}); // [ { maxBalance: 98000 } ]
            
          });

        // Values.aggregate().
        //     group({ _id: '$value', i_total: { $sum: 1 } }).
        //     exec(function (err, res) {
        //         if (err) return err;
        //         let a = res;
        //         console.log(res); 
        //     });

        // Values.find( async function(err, result) {
            
        //     if (err) {
        //         console.log(err);
        //         res.send('database error');
        //         return
        //     }
          
        //     await Values.count({}, function( err, count){
        //         total = count;
        //     });
            
            
        // });
       
    },



    getlinkbytop10key :  async function(key, res) {
        let total = 0;
        let check;
        let keysearch = key;
        let values = {};

        await Links.count({}, function( err, count){
                    total = count;
                });

        Links.aggregate([
            { $group: { _id: '$link', value : { $first: "$value" }, i_total: { $sum: 1 }}},
            { $project: { _id: 1, i_total: 1 , value: 1}}
            
          ]).
          then(function (result) {
            for (let i in result) {
                
                    let val = result[i]; 
                        if(val["value"] === key)
                        {
                            values[val["_id"]] = [val["_id"], val["value"] , val["i_total"]];

                        }
             
            }

            title = process.env.TITLE || 'Fshare demo'
            res.render('table-data-top10key', {keysearch, values: values , total: total}); // [ { maxBalance: 98000 } ]
            
          });

        // Values.aggregate().
        //     group({ _id: '$value', i_total: { $sum: 1 } }).
        //     exec(function (err, res) {
        //         if (err) return err;
        //         let a = res;
        //         console.log(res); 
        //     });

        // Values.find( async function(err, result) {
            
        //     if (err) {
        //         console.log(err);
        //         res.send('database error');
        //         return
        //     }
          
        //     await Values.count({}, function( err, count){
        //         total = count;
        //     });
            
            
        // });
       
    },
    
    getVallinkbykey :  async function(res) {
        let total = 0;
        let check;
        let title = '';
        let values = {};

        await Links.count({}, function( err, count){
                    total = count;
                });

        Links.aggregate([
            { $group: { _id: '$value', i_total: { $sum: 1 }}},
            { $project: { _id: 1, i_total: 1 }}
          ]).
          then(function (result) {
            for (let i in result) {
               
                    let val = result[i]; 

                    
                    
                    
                        values[val["_id"]] = [val["_id"], val["i_total"]];
                    
                    
                        
               
            }

            title = process.env.TITLE || 'Fshare demo'
            res.render('table-data-linkbykey', {title, values: values , total: total}); // [ { maxBalance: 98000 } ]
            
          });

        // Values.aggregate().
        //     group({ _id: '$value', i_total: { $sum: 1 } }).
        //     exec(function (err, res) {
        //         if (err) return err;
        //         let a = res;
        //         console.log(res); 
        //     });

        // Values.find( async function(err, result) {
            
        //     if (err) {
        //         console.log(err);
        //         res.send('database error');
        //         return
        //     }
          
        //     await Values.count({}, function( err, count){
        //         total = count;
        //     });
            
            
        // });
       
    },

    getkeyDetail : async function(key ,res) {
        let total = 0;
        await Values.count({value: key}, function( err, count){
            total = count;
        });
        Values.find( {value: key} ,async function(err, result) {
            
            
            
            if (err) {
                console.log(err);
                res.send('database error');
                return
            }
          
            
            var values = {};
            for (var i in result) {
                

                
                    var val = result[i];
                    let dateT =  getDateT(val["date"]); 
                    let Time = getDateTime(val["date"]);
                    
               
                    values[val["_id"]] = [val["value"], Time, dateT ];
                
                
                
                
                
            }
            var title = process.env.TITLE || 'Fshare demo'
            res.render('table-data-key-detail', {title,key: key,values: values , total: total});
        });
    },

    getlinkbykeyDetail : async function(key ,res) {
        let total = 0;
        let keysearch = key;
        await Links.count({vaulue: key}, function( err, count){
            total = count;
        });
        Links.find( {value: key} ,async function(err, result) {
            
            
            
            if (err) {
                console.log(err);
                res.send('database error');
                return
            }
          
            
            var values = {};
            for (var i in result) {
                

                
                    var val = result[i];
                    let dateT =  getDateT(val["date"]); 
                    let Time = getDateTime(val["date"]);
                    
               
                    values[val["_id"]] = [val["title"], val["link"], Time, dateT];
                
                
                
                
                
            }
            let keysearch = key;
            res.render('table-data-linkbykey-detail', {keysearch,key: key,values: values , total: total});
        });
    },

    getlinkbylinkDetail : async function(key ,res) {
        let total = 0;
        
        await Links.count({link: key}, function( err, count){
            total = count;
        });
        Links.find( {link: key} ,async function(err, result) {
            
            
            
            if (err) {
                console.log(err);
                res.send('database error');
                return
            }
          
            
            var values = {};
            for (var i in result) {
                

                
                    var val = result[i];
                    let dateT =  getDateT(val["date"]); 
                    let Time = getDateTime(val["date"]);
                    
               
                    values[val["_id"]] = [val["title"], val["link"], Time, dateT, val["value"]];
                
                
                
                
                
            }
            let link = key;
            res.render('table-data-linkbylink-detail', {link,key: key,values: values , total: total});
        });
    },

    sendVal : function(val, date, res) {
        // var count;
        // find value
        // Values.findOne({value: val}, function(err,obj) { count = obj.count; });
        
        
        
        var request = new Values({value: val, date: date});
        request.save((err, result) => {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({status: "error", value: "Error, db request failed"}));
                return
            }
            this.updateGauge();
            statsd.increment('creations');
            res.status(201).send(JSON.stringify({status: "ok", value: result["value"], id: result["_id"]}));
        });
    },

    sendLink : function(val, link, title, date, res) {
        // var count;
        // find value
        // Values.findOne({value: val}, function(err,obj) { count = obj.count; });
        
        
        
        var request = new Links({value: val, link: link, title: title, date: date});
        request.save((err, result) => {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({status: "error", value: "Error, db request failed"}));
                return
            }
            this.updateGauge();
            statsd.increment('creations');
            res.status(201).send(JSON.stringify({status: "ok", value: result["value"], id: result["_id"]}));
        });
    },

    delVal : function(id) {
        Values.remove({_id: id}, (err) => {
            if (err) {
                console.log(err);
            }
            this.updateGauge();
            statsd.increment('deletions');
        });
    }
};


// Use of Date.now() method 
function getDateTime(dateIP){
    let today = new Date(dateIP);
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time;
  }

  function getDateT(dateIP){
    let today = new Date(dateIP);
    let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    return date;
  }  
  