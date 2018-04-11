var server = require('../index.js');
const db = require('../db.js').db;
var Promise = require('bluebird');

beforeEach('clean db', done => {
  db.tx(t => {
    return t.batch([
      t.query(`TRUNCATE TABLE connection CASCADE;`),
      t.query(`TRUNCATE TABLE block_list CASCADE;`),
    ]);
  })
  .then(() => done());
})