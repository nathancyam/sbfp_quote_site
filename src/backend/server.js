const http = require('http');
const express = require('express');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(__dirname + '/../../config.json'));
const bootstrap = require('./bootstrap');

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

function boot() {
  server.listen(4567, err => {
    if (err) {
      console.error(err);
    }

    console.log('Server started and listening to port 4567');
  });
}

bootstrap(app, io, config)
  .then(() => boot());
