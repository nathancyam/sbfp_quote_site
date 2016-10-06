const nunjucks = require('nunjucks');
const morgan = require('morgan');
const session = require('express-session');
const RedisSession = require('connect-redis')(session);
const Redis = require('ioredis');

const routes = require('./routes');
const Sockets = require('./sockets');
const QuoteService = require('./services/quotes');

function nunjucksBoot(app, config) {
  let nunjunksConfig = {
    autoescape: true,
    express: app
  };

  if (process.env['NODE_ENV'] === 'production') {
    app.use(morgan('combined'));
    console.log('Templates: Production');
    nunjucks.configure(__dirname + '/views', nunjucks);
  } else {
    app.use(morgan('dev'));
    console.log('Templates: Development');
    nunjucks.configure(__dirname + '/views', Object.assign({}, nunjunksConfig, config.nunjucks));
  }

  return app;
}

module.exports = function (app, io, config) {

  const redis = new Redis(config.redis);
  const sessionMiddleware = session(Object.assign({}, config.session, {
    store: new RedisSession({})
  }));

  nunjucksBoot(app, config);
  const quoteService = new QuoteService();

  return quoteService.build()
    .then(quoteService => {
      app.set('quote_service', quoteService);
      routes(app, sessionMiddleware, redis, Sockets.actions);
      Sockets.setupSockets(io, redis);
    });
};
