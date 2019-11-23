const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

// open the database
exports.connect = async (dbname = '') => {
    return new Promise((resolve, reject) => {
        const dbPath = path.join(__dirname, dbname === '' ? '../test.db' : `../${dbname}.db`);
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                reject(`${err.name} ${err.message}`);
            } else {
                resolve('Connected to the database.')
            }
        });
    })
}

getDBInstance = async () => {
    return new Promise((resolve, reject) => {
        db ? resolve(db) : reject(new Error('db is not connected yet, connect it first.'));
    })
}

exports.disconnect = async () => {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) {
                console.error(err.message);
                reject(err.message);
            } else {
                console.log('Close the database connection.');
                resolve('Close the database connection.');
            }
        });
    })
}

exports.runQuery = async (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                console.log('Error running sql ' + sql)
                console.log(err)
                reject(err)
            } else {
                resolve({ id: this.lastID })
            }
        })
    })
}

exports.findOne = async (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, result) => {
            if (err) {
                console.log('Error running sql: ' + sql)
                console.log(err)
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

exports.find = async (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.log('Error running sql: ' + sql)
                console.log(err)
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}