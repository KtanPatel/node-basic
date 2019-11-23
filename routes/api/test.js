var express = require('express');
var router = express.Router();
var db = require('./../../helpers/sqlite');


/**
 * SQLite Queries Example
 * This is for testing purpose, do not follow below structure.
 * It would be great, if we divide logic and routes to diffrent/separate files
 */
router.post('/', async function (req, res) {

    // Queries Examples

    // Connect
    db.connect().then(res => {
        console.log('\n >>>>> connect: ', 'res ===>', res);
    }).catch(err => {
        console.log('\n >>>>> connect: ', 'err ===>', JSON.stringify(err));
    });

    // Create tables
    db.runQuery(
        `CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT)`
    ).then(res => {
        console.log('\n >>>>> Table Created; Projects <<<<< ');
        db.runQuery(
            `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        isComplete INTEGER DEFAULT 0,
        projectId INTEGER,
        CONSTRAINT tasks_fk_projectId FOREIGN KEY (projectId)
        REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE)`
        ).then(res => {
            console.log('\n >>>>> Table Created; tasks <<<<< ');

            // Insert Records
            Promise.all([
                db.runQuery(`INSERT INTO projects (name) VALUES (?)`, ['NodeJS']),
                db.runQuery(`INSERT INTO projects (name) VALUES (?)`, ['Angular']),
                db.runQuery(`INSERT INTO projects (name) VALUES (?)`, ['React']),
                db.runQuery(`INSERT INTO projects (name) VALUES (?)`, ['Vue']),
                db.runQuery(`INSERT INTO projects (name) VALUES (?)`, ['Electron']),
            ]).then(res => {
                console.log('\n >>>>> Record Inserted; projects <<<<< ');

                // Insert Records
                Promise.all([
                    db.runQuery(
                        `INSERT INTO tasks (name, description, isComplete, projectId)
            VALUES (?, ?, ?, ?)`,
                        ['Rest API', 'with documentation (eg. Swagger UI)', 'false', 1]),
                    db.runQuery(
                        `INSERT INTO tasks (name, description, isComplete, projectId)
            VALUES (?, ?, ?, ?)`,
                        ['Event Management', 'Firebase + RxJS', 'false', 2]),
                    db.runQuery(
                        `INSERT INTO tasks (name, description, isComplete, projectId)
            VALUES (?, ?, ?, ?)`,
                        ['Instagram Clone', 'extends/includes all features', 'false', 3]),
                    db.runQuery(
                        `INSERT INTO tasks (name, description, isComplete, projectId)
            VALUES (?, ?, ?, ?)`,
                        ['Analytics Survey', 'use Vuetify only', 'false', 4])
                ]).then(res => {
                    console.log('\n >>>>> Record Inserted; tasks <<<<< ');

                    // Update Data
                    db.runQuery(
                        `UPDATE projects SET name = ? WHERE id = ?`,
                        ['Node', 1]
                    ).then(res => {
                        console.log('\n >>>>> Record updated; <<<<< ', res);

                        // Delete
                        db.runQuery(
                            `DELETE FROM projects WHERE id = ?`,
                            [5]
                        ).then(res => {
                            console.log('\n >>>>> Record Deleted <<<<< ', res);

                            // Select/Get Record
                            db.findOne(
                                `SELECT * FROM projects WHERE id = ?`,
                                [1]
                            ).then(res => {
                                console.log('\n >>>>> Record Fetched <<<<< ', res);

                                // Get All
                                db.find(
                                    `SELECT * FROM projects`
                                ).then(res => {
                                    console.log('\n >>>>> Records Fetched <<<<< ', res);
                                }).catch(err => {
                                    console.log('\n >>>>> 8. err <<<<< ');
                                });
                            }).catch(err => {
                                console.log('\n >>>>> 7. err <<<<< ');
                            });
                        }).catch(err => {
                            console.log('\n >>>>> 6. err <<<<< ');
                        });
                    }).catch(err => {
                        console.log('\n >>>>> 5. err <<<<< ');
                    });
                }).catch(err => {
                    console.log('\n >>>>> 4. err <<<<< ');
                });
            }).catch(err => {
                console.log('\n >>>>> 3. err <<<<< ');
            });
        }).catch(err => {
            console.log('\n >>>>> 2. err <<<<< ');
        });

    }).catch(err => {
        console.log('\n >>>>> 1. err <<<<< ');
    });


    db.disconnect();

    res.status(200).send({ user: req.headers[`user-agent`] });
});

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Test Section For SQLite' });
});

module.exports = router;