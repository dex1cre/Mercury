//Подключаем модули
var express, bodyParser, sqlite3, app, db, port;

express = require('express');
bodyParser = require('body-parser');
sqlite3 = require('sqlite3').verbose();
db = new sqlite3.Database('some_db.db');
port = 3000;
app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.disable("x-powererd-by");
app.use(express['static'](__dirname + '/public'));
app.set('view engine', 'pug');

app.get('/', function(req, res) {
	res.end("Hello");
});

var server = app.listen(port, function() {
	console.log("Server started on the " + port + " port");
})