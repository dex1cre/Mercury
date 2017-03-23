//Подключаем модули
var express, bodyParser, app, port, server;

express = require('express');
bodyParser = require('body-parser');
server = require('./server');
port = 3000;
app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.disable("x-powererd-by");
app.use(express['static'](__dirname + '/public'));
app.set('view engine', 'pug');


app.use(function(req, res, next) {
	if (server.data[req.url]) {
		server.data[req.url](req, res);
	} else {
		res.end("404, not found!");
	}
});


app.listen(port, function(req, res) {
	console.log("Server start on port " + port);
});