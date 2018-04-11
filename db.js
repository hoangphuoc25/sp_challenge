var Promise = require('bluebird');
var pgp = require('pg-promise')({
  promiseLib: Promise
});

var db = pgp(process.env.DATABASE_URL);

module.exports.db = db;
module.exports.pgp = pgp;
