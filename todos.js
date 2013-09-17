var MongoClient = require('mongodb').MongoClient;

var conn = new MongoClient;

conn.connect('mongodb://localhost:27017/test',function(err,db){
	if(err) return console.log('cannot connect to database',err);
	console.log('connection established');

});