var sqlite3, bd;
sqlite3 = require("sqlite3").verbose();
db = new sqlite3.Database("some_db.db");


var index = function(req, res) {
	res.end("hello, mutherfucker");
}


data = {
	"/": index
}

exports.data = data;