var index = function(req, res) {
	res.render("admin", {noneObject: "Ok", tables: tables})
}

var getAll = function(req, res) {
	var nameTable = tables[req.query.t][0];

	db.serialize(function() {
		return db.all("SELECT * FROM " + nameTable, function(err, rows) {
			if (err)
				console.log(err);
			res.render('admin', {data: rows, dataOk: "Ok", tables: tables, tableName: req.query.t});
		});
	});
}

var getOnse = function(req, res) {
	var nameTable = tables[req.query.t][0];
	var numberRow = req.query.number;

	db.serialize(function() {
		return db.all("SELECT * FROM " + nameTable + " WHERE id=$id", {
			$id: numberRow
		}, function(err, rows) {
			if (err)
				console.log(err);
			res.render("admin", {one_data: rows, one_dataOk: "Ok", tables: tables, tableName: req.query.t});
		});
	});
}

var save = function(req, res) {
	var table = tables[req.body.table][0];
	var id = req.body.id;

	var sql = "UPDATE " + table + " SET ";
	var flag = true;
	var k = 0;

	for (i in req.body) {
		if (k > 1) {
			if (k != tables[req.body.table][1].length)
				sql = sql +  i + "='" + req.body[i] + "', ";
			else
				sql = sql +  i + "='" + req.body[i] + "' ";
		}
		k++;

		if (req.body[i] == "") {
			flag = false;
			break;
		}
	}

	if (flag) {
		sql += "WHERE id=" + id;

		console.log(sql);

		db.serialize(function() {
			return db.run(sql, function(err) {
				if (err)
					console.log(err);
				return res.redirect("/be-admin/number?t="+req.body.table+"&&number="+id);
			});
		});
	} else {
		res.end("Введены не все данные!")
	}
}

var dlt = function(req, res) {
	var table = tables[req.body.table][0];
	var id = req.body.id;

	var sql = "DELETE FROM " + table + " WHERE id=" + id;

	db.serialize(function() {
		return db.run(sql, function(err) {
			if (err)
				console.log(err);
			res.redirect("/be-admin/all?t=" + req.body.table);
		});
	});
}

tables = {
	't': [ "test", [
		"id", "title", "description"
	], "t"],
}

data = {
	"/be-admin": index,
	"/be-admin/all": getAll,
	"/be-admin/number": getOnse,
	'/be-admin/save': save,
	'/be-admin/delete': dlt
}

exports.data = data;