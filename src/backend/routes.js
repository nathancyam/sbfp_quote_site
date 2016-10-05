const SocketActions = require('./sockets').actions;
const bodyParser = require('body-parser');

const GameRouter = require('./routers/game');
const jsonParser = bodyParser.json();

module.exports = function (app, session) {

  app.use('/guess', GameRouter(
    [session, jsonParser],
    app.get('quote_service'),
    SocketActions
  ));

  app.get('/', (req, res) => {
    let bodyClass = '';
    const quote = req.app.get('quote_service').getRandomQuote();

    switch (quote.speaker.slice(0, 3).toLowerCase()) {
      case 'lia':
        bodyClass = 'quote-liam';
        break;

      case 'pat':
        bodyClass = 'quote-pat';
        break;

      case 'woo':
        bodyClass = 'quote-wool';
        break;

      case 'mat':
        bodyClass = 'quote-matt';
        break;
    }

    bodyClass += ' quote';
    res.render('quote.html.twig', { quote, bodyClass });
  });

  app.post('/difficulty', session, jsonParser, (req, res) => {
    const difficulty = req.body['difficulty'];
    const session = req.session;

    if (['person', 'show', 'hardmode'].find(el => difficulty)) {
      session.gameMode = difficulty;
      return res.json({ status: 'SUCCESS', message: `Difficulty updated to ${difficulty}`});
    }

    return res.statusCode(400).json({ status: 'ERROR' });
  });

  app.post('/join', session, jsonParser, (req, res) => {
    const body = req.body;
    const session = req.session;
    const player = Object.assign({}, body, { id: `player_${Date.now()}`});

    session.player = player;

    SocketActions.joinGame(player);
    return res.json(player);
  });
};
