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

  // Assuming friendship status stays the same if one blocks the other
  getFriends: function(target) {
    return db.query(`select requestor from connection where target=$/target/ and type='friend'`, {
      target
    })
    .map(x => x.requestor);
  },

  getCommonFriends: function(email1, email2) {
    if (email1 == email2) {
      var err = new Error("Emails must be different");
      err.statusCode = 400;
      return Promise.reject(err);
    }

    return db.query(`select requestor from connection where target=$/email1/
      intersect
      (select requestor from connection where target=$/email2/)`, {
        email1,
        email2
      })
      .map(x => x.requestor);
  },

  block: function(blocker, blockee) {
    if (!blocker || !blockee) {
      var err = new Error("requestor and target are required");
      err.statusCode = 400;
      return Promise.reject(err);
    }

    if (blocker == blockee) {
      var err = new Error("Emails must be different");
      err.statusCode = 400;
      return Promise.reject(err);
    }

    return db.query(`insert into block_list (id, blocker, blockee) values (DEFAULT, $/blocker/, $/blockee/)`, {
      blocker: blocker,
      blockee: blockee
    });
  },

  addSubscription: function(follower, followee) {
    return Promise.resolve(true);
  },

  getSubscription: function(email, text) {
    return Promise.resolve([]);
  }
}
