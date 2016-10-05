const http = require('http');
const express = require('express');
const nunjucks = require('nunjucks');
const morgan = require('morgan');
const _ = require('lodash');
const session = require('express-session');
const routes = require('./backend/routes');
const QuoteService = require('./backend/quote_service');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(__dirname + '/../config.json'));
const RedisStore = require('connect-redis')(session);
const sockets = require('./backend/sockets').setupSockets;

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

const sessionOptions = Object.assign({}, config.session, {
  store: new RedisStore({})
});

const sessionMiddleware = session(sessionOptions);

let nunjunksConfig = {
  autoescape: true,
  express: app
};

if (process.env['NODE_ENV'] === 'production') {
  app.use(morgan('combined'));
  console.log('Templates: Production');
  nunjucks.configure(__dirname + '/../views', nunjucks);
} else {
  app.use(morgan('dev'));
  console.log('Templates: Development');
  nunjucks.configure(__dirname + '/../views', Object.assign({}, nunjunksConfig, config.nunjucks));
}


function boot() {
  server.listen(4567, err => {
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
    routes(app, sessionMiddleware);
    sockets(io);
    boot(app);
  });
