const friend = require('./services/ConnectionService.js');

module.exports = function(app) {
  app.post('/friend', function(req, res, next) {
    return friend.addFriend(req.body.friends)
      .then(result => {
        return res.ok();
      })
      .catch(res.jsonError)
  });

  app.get('/friends', function(req, res, next) {
    return friend.getFriends(req.query.email)
      .then(result => {
        return res.ok({
          friends: result,
          count: result.length
        })
      })
      .catch(res.jsonError);
  });

  app.get('/commonFriends', function(req, res, next) {
    return friend.getCommonFriends(req.query.email1, req.query.email2)
      .then(result => {
        return res.ok({
          friends: result,
          count: result.length
        });
      })
      .catch(res.jsonError);
  });

  app.post('/blocking', function(req, res, next) {
    return friend.block(req.body.requestor, req.body.target)
      .then(result => {
        return res.ok();
      })
      .catch(res.jsonError);
  });

  app.post('/subscription', function(req, res, next) {
    return friend.addSubscription(req.body.requestor, req.body.target)
      .then(result => {
        return res.ok();
      })
      .catch(res.jsonError);
  });

  app.post('/query/subscriptions', function(req, res, next) {
    return friend.getSubscription(req.body.sender, req.body.text)
      .then(result => {
        return res.ok({
          recipients: result
        });
      })
      .catch(res.jsonError);
  });
}
