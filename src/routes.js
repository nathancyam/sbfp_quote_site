const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {
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

  app.get('/guess/new', (req, res) => {
    const quoteService = req.app.get('quote_service');
    const { id, quote, speaker, game } = quoteService.getRandomQuote();
    const gameMode = req.session.gameMode;

    switch (gameMode) {
      case 'hardmode':
        return res.json({ id, quote });

      case 'show':
        return res.json({ id, quote, game });

      case 'person':
        return res.json({ id, quote, speaker });
    }
  });

  app.get('/guess', (req, res) => {
    const session = req.session;
    const gameMode = session.gameMode || 'hardmode';
    session.score = session.score || 0;

    const quoteService = req.app.get('quote_service');
    const quote = quoteService.getRandomQuote();
    const origins = quoteService.getOrigins();
    const speakers = {
      liam: 'Liam',
      wool: 'Woolie',
      matt: 'Matt',
      pat: 'Pat'
    };

    const jsonOrigins = Object.keys(origins)
      .reduce((accl, el) => {
        accl.push({ label: origins[el], value: el });
        return accl;
      }, []);

    res.render('guess.html.twig', { quote, origins, speakers, gameMode, jsonOrigins });
  });

  app.post('/guess', jsonParser, (req, res) => {
    const body = req.body;
    const session = req.session;

    if (!body.id) {
      return res.redirect('/guess');
    }

    const quoteService = req.app.get('quote_service');
    if (quoteService.isCorrect(body, session.gameMode === 'hardmode')) {
      session.score++;
      return res.json({ status: 'SUCCESS', score: session.score });
    }

    return res.json({ status: 'FAILED', score: session.score });
  });

  app.post('/difficulty', urlencodedParser, (req, res) => {
    const difficulty = req.body['difficulty'];
    const session = req.session;

    if (['person', 'show', 'hardmode'].find(el => difficulty)) {
      session.gameMode = difficulty;
      return res.redirect('/guess');
    }

    return res.redirect('/');
  });
};
