const Router = require('express').Router;
const initialState = require('../../lib/state');

function GameRouter(router, [ quoteService, SocketActions, socketStore ]) {

  router.get('/new', (req, res) => {
    const { id, quote, speaker, game } = quoteService.getRandomQuote();
    const gameMode = req.session.gameMode;

    switch (gameMode) {
      case 'hardmode':
        return res.json({ id, quote });

      case 'show':
        return res.json({ id, quote, game });

      case 'person':
        return res.json({ id, quote, speaker });

      default:
        return res.json({ id, quote, speaker });
    }
  });

  router.get('/scoreboard', (req, res) => {
    return res.json(socketStore.getState().sockets);
  });

  router.get('/', (req, res) => {
    const session = req.session;
    const gameMode = session.gameMode || 'person';
    session.score = session.score || 0;

    const quote = quoteService.getRandomQuoteForDifficulty(gameMode);
    const player = Object.assign({ id: '', name: '', score: 0 }, session.player, { score: session.score });
    const state = Object.assign({}, initialState, {
      player,
      quote
    });

    const origins = quoteService.getOrigins();
    const showOptions = Object.keys(origins)
      .reduce((accl, el) => {
        accl.push({ label: origins[el], value: el });
        return accl;
      }, []);

    state.difficultyOptions.selectedValue = gameMode;
    state.showOptions.options = showOptions;

    res.render('guess.html.twig', { state });
  });

  router.post('/', (req, res) => {
    const body = req.body;
    const session = req.session;

    if (!body.id) {
      return res.redirect('/guess');
    }

    if (quoteService.isCorrect(body, session.gameMode === 'hardmode')) {
      session.score++;
      SocketActions.scorePoint(session.player, session.score);
      return res.json({ status: 'SUCCESS', score: session.score });
    }

    const correctAnswer = quoteService.findById(body.id);
    return res.json({ status: 'FAILED', score: session.score, correctAnswer });
  });

  return router;
}

module.exports = (middlewares, ...dependencies) => {

  const router = Router();
  middlewares.forEach(middleware => router.use(middleware));

  return GameRouter(router, dependencies);
};
