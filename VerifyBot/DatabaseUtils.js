const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

/**
 * Class DatabaseUtils
 * @author Jan Sohn / xxAROX - <jansohn@hurensohn.me>
 * @date 05.05.2021 - 00:38
 * @project MMOX-Bot
 */
class DatabaseUtils {
	static async isTable(database, table) {
		return new Promise(function(resolve, reject) {
			if (!fs.existsSync(database)) {
				reject(new Error("Database file not found"));
			} else {
				let db = new sqlite3.Database(database, (err) => {if (err) {reject(err);}});
				db.all(`SELECT 1 FROM ${table};`, [], (err, rows) => {
					if (err) {
						resolve(false);
						return;
					}
					if (rows[0] && rows[0]["1"] === 1) {
						resolve(rows[0]["1"] === 1);
					} else {
						resolve(false);
					}
				});
				db.close();
			}
		});
	}

	static async query(database, query) {
		return new Promise(function(resolve, reject) {
			if (!fs.existsSync(database)) {
				reject(new Error("Database file not found"));
			} else {
				let db = new sqlite3.Database(database, (err) => {if (err) {reject(err);}});
				db.all(query, [], (err, rows) => {
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
				});
				db.close();
			}
		});
	}
}
module.exports = DatabaseUtils;
