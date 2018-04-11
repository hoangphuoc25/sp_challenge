const db = require('./db.js').db;
var Promise = require('bluebird');
const _ = require('lodash');

var self = module.exports = {
  addFriend: function(args) {
    return Promise.resolve(true);
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
