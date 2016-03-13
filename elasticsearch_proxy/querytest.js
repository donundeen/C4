/* 

https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html

*/

console.log("starting");

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:3010',
  log: 'trace'
});


var querybody = {
      query: {
         "match_all" : {}
      }
};


querybody = {
    query : {
      query_string: {
            "query" : "*:*"
      }
  }
};



var search = {
  index: 'c5',
  type: 'harvardobject',
  body: querybody
};



console.log("doing search:");
console.log(JSON.stringify(search, null, " "));

client.search(search).then(function (resp) {
  console.log("got result:");
  console.log(JSON.stringify(resp, null, "  "));
  process.exit();
}, function (err) {
  console.log("got error: ");
  console.log(JSON.stringify(err, null, "  "));
  process.exit();
}); 


console.log("done");

