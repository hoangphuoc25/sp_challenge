const db = require('./db.js').db;
var Promise = require('bluebird');
const _ = require('lodash');

var self = module.exports = {
  addFriend: function(args) {
    if (!_.isArray(args)) {
      var err = new Error("Must be an array");
      err.statusCode = 400;
      return Promise.reject(err);
    }

    if (args.length != 2) {
      var err = new Error("Insufficient data, must provide exactly 2 emails");
      err.statusCode = 400;
      return Promise.reject(err);
    }

    if (args[0] == args[1]) {
      var err = new Error("Emails must be different");
      err.statusCode = 400;
      return Promise.reject(err);
    }

    let [requestor, target] = args;

    return db.query(`select * from block_list
        where blocker=$/requestor/ and blockee=$/target/
        or blocker=$/target/ and blockee=$/requestor/`, {
      requestor, target
    })
    .then(result => {
      if (result.length == 0) {
        return db.query(`insert into connection (id, requestor, target, type) 
            values (DEFAULT, $/requestor/, $/target/, 'friend'), (DEFAULT, $/target/, $/requestor/, 'friend')`, {
          requestor,
          target
        })
      } else {
        var err = new Error("Unable to add friend: in blocklist");
        err.statusCode = 400;
        return Promise.reject(err);
      }
    })
    .catch(e => {
      console.log('e.message', e.message);
      console.log('e', e.stack);
      throw e;
    })
  },

  getFriends: function(target) {
    return Promise.resolve([]);
  },

  getCommonFriends: function(email1, email2) {
    return Promise.resolve([]);
  },

  block: function(blocker, blockee) {
    return Promise.resolve(true);
  },

  addSubscription: function(follower, followee) {
    return Promise.resolve(true);
  },

  getSubscription: function(email, text) {
    return Promise.resolve([]);
  }
}
