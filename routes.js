const friend = require('./friend.js');
// const subscription = require('./subscription.js');
var Promise = require('bluebird');

module.exports = function(app) {
  app.post('/friend', function(req, res, next) {
    return friend.addFriend(req.body.friends)
      .then(result => {
        return res.status(200)
          .json({
            success: true,
          })
      })
      .catch(err => {
        res.status(err.statusCode || 500)
          .json({
            success: false,
            message: err.message
          })
      })
  });

  app.get('/friends', function(req, res, next) {
    return friend.getFriends(req.query.email)
      .then(result => {
        return res.status(200)
          .json({
            success: true,
            friends: result,
            count: result.length
          })
      })
      .catch(err => {
        res.status(err.statusCode || 500)
          .json({
            success: false,
            message: err.message
          })
      });
  });

  app.get('/commonFriends', function(req, res, next) {
    return friend.getCommonFriends(req.query.email1, req.query.email2)
      .then(result => {
        return res.status(200)
          .json({
            success: true,
            friends: result,
            count: result.length
          })
      })
      .catch(err => {
        res.status(err.statusCode || 500)
          .json({
            success: false,
            message: err.message
          })
      });
  });

  app.post('/blocking', function(req, res, next) {
    return friend.block(req.body.requestor, req.body.target)
      .then(result => {
        return res.status(200)
          .json({
            success: true,
          })
      })
      .catch(err => {
        res.status(err.statusCode || 500)
          .json({
            success: false,
            message: err.message
          })
      });
  });

  app.post('/subscription', function(req, res, next) {
    return friend.addSubscription(req.body.requestor, req.body.target)
      .then(result => {
        return res.status(200)
          .json({
            success: true
          });
      })
      .catch(err => {
        res.status(err.statusCode || 500)
          .json({
            success: false,
            message: err.message
          })
      });
  });

  app.post('/query/subscriptions', function(req, res, next) {
    return friend.getSubscription(req.body.sender, req.body.text)
      .then(result => {
        return res.status(200)
          .json({
            success: true,
            recipients: result
          });
      })
      .catch(err => {
        res.status(err.statusCode || 500)
          .json({
            success: false,
            message: err.message
          })
      });
  });
}
