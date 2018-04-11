const routes = require('./routes');
const express = require('express');
const app = express();
const db = require('./db.js');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.ok = function(result) {
    const responseBody = Object.assign({}, { success: true }, result);
    return res.status(200)
      .json(responseBody)
  }

  res.jsonError = function(err) {
    const responseBody = Object.assign({}, { success: false }, { message: err.message });
    return res.status(err.statusCode || 500)
      .json(responseBody);
  }
  next();
});

app.set('port', (process.env.PORT || 5000))

routes(app);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
