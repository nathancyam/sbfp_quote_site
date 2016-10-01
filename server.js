const express = require('express');
const nunjucks = require('nunjucks');
const morgan = require('morgan');
const _ = require('lodash');
const session = require('express-session');
const routes = require('./src/routes');
const QuoteService = require('./src/quote_service');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
const RedisStore = require('connect-redis')(session);

const app = express();

app.use(morgan('combined'));
app.use(express.static('public'));

const sessionOptions = Object.assign({}, config.session, {
  store: new RedisStore({})
});

app.use(session(sessionOptions));

nunjucks.configure(__dirname + '/views', {
  autoescape: true,
  express: app
});

function boot(app) {
  app.listen(4567, err => {
    if (err) {
      console.error(err);
    }

    console.log('Server started and listening to port 4567');
  });
}

const quoteService = new QuoteService();
quoteService.build()
  .then(service => {
    app.set('quote_service', service);
    routes(app);
    boot(app);
  });
