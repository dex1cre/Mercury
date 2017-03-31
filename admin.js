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
	var table = tables[req.query.t][0];
	var id = req.query.number;

	var sql = "UPDATE " + table + " SET ";
	var flag = true;
	var sch = 0

	for (i in req.body)
		if (req.body[i])
			sch++;

	for (i in req.body) {
		if (req.body[i])
			console.log(i);

		if(req.body[i] != "" && sch-1>0) {
			sql += i + "='" + req.body[i] + "', ";
			sch--;
		} else if (req.body[i] != "" && sch == 1) {
			sql += i + "='" + req.body[i] + "' ";
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
				return res.redirect("/be-admin/number?t="+req.query.t+"&&number="+id);
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

var nw = function(req, res) {
	res.render("admin", {newOk: "Ok", tables: tables, tableName: req.query.t});
}

var newD = function(req, res) {
	var table = tables[req.query.t][0];
	var id = req.body.id;

	var sql = "INSERT INTO " + table + "(";
	var k = 0;

	for (i in tables[req.query.t][1]) {
		if(k == tables[req.query.t][1].length-1) {
			sql += tables[req.query.t][1][i] + ") ";
			break
		} else if (tables[req.query.t][1][i] != "id")
			sql += tables[req.query.t][1][i] + ", ";
		 
		k++;
	}
	k = 0;

	sql += "VALUES(";
	var flag = true;

	for (i in req.body) {
		if (k != tables[req.query.t][1].length-2)
			sql += "'" + req.body[i] + "', ";
		else
			sql += "'" + req.body[i] + "') ";

		if (req.body[i] == "") {
			flag = false;
			break;
		}
		k++;
	}

	if (flag) {

		db.serialize(function() {
			return db.run(sql, function(err) {
				if (err)
					console.log(err);
				return res.redirect("/be-admin/all?t="+req.query.t);
			});
		});
	} else {
		res.end("Введены не все данные!")
	}
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
	'/be-admin/delete': dlt,
	'/be-admin/nw': nw,
	'/be-admin/new': newD
}

exports.data = data;