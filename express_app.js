var express = require('express'),
	app = express();

var db = require('./lib/db');

db.connect('');
db.connection.on('open', function (db) {
	console.log('Connection established to database.');
});

db.connection.on('error', function(err) {
	console.log('Error on connection: ', err);
});

app.configure(function () {
	app.set('view engine', 'ejs');
	app.set('views', __dirname + '/public/views');
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(app.router);
});

var task = db.model('Task');

// curl localhost:9090
app.get('/', function (req, res) {
	task.read(function (err, docs) {
		if (err) {
			res.statusCode = 500;
			res.end('Something went wrong');
		}
		// // res.end only accepts string or buffer
		// // so convert the docs object to string before sending to the client
		// res.end(JSON.stringify(docs));
		res.render('index', { todos: docs, title: 'todo application'});
	});
});

// curl -X POST -d "entry=Learn javascript" localhost:9090
app.post('/', function (req, res) {
	console.log(req.body);
	task.insert(req.body, function (err, entry) {
		if (err) {
			res.statusCode = 505;
			res.end('Something went wrong.');
		}
		res.redirect('/');
	})
});

// curl -X DELETE localhost:9090/1
app.delete('/:id', function (req, res) {

var id = parseInt(req.params.id);
	task.delete( { '_id' : id }, function (err, data) {
		if (err) {
			res.statusCode = 505;
			res.end('Something went wrong.');
		}
		res.end('Delete Success! \n');
	});
});

// curl -X PUT -d "entry=Javascript is awesome" localhost:9090/0
app.put('/:id', function (req, res) {
	var id = parseInt(req.params.id.split("__")[0]);
	var entry = req.params.id.split("__")[1];
	task.update( { '_id' : id, 'entry' : entry }, function (err, data) {
		if (err) {
			res.statusCode = 505;
			res.end('Something went wrong.');
		}
		res.end('Delete Success! \n');
	});
});

app.listen(9090, function () {
	console.log('App listening on localhost:9090');
});