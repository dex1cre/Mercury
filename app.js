//Подключаем модули
var express, bodyParser, app, port, server, admin, helmet;

express = require('express');
bodyParser = require('body-parser');
server = require('./server');
admin = require('./admin');
helmet = require('helmet');
port = 3000;
app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.disable("x-powererd-by");
app.use(express['static'](__dirname + '/public'));
app.set('view engine', 'pug');
app.use(helmet())

app.use(function(req, res, next) {
	if(server.data[req.path])
	{
		server.data[req.path](req, res);
	} else if (admin.data[req.path]) {
		admin.data[req.path](req, res);
	} else {
		res.end("404");
	}
});


app.listen(port, function(req, res) {
	console.log("Server start on port " + port);
});