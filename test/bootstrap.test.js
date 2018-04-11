var server = require('../index.js');
const db = require('../db.js').db;
var Promise = require('bluebird');

beforeEach('clean db', done => {
  done();
})