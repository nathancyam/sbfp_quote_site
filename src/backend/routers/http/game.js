const initialState = require('../../../lib/state');

function GameRouter(router, quoteService, SocketActions, redis) {

  router.post('/join', (req, res) => {
    const body = req.body;
    const session = req.session;

    const isReturningPlayer = (typeof session.player !== 'undefined' && session.player.id === body.id);
    if (isReturningPlayer) {
      SocketActions.joinGame(session.player);
      return res.json(session.player);
    }

    const player = Object.assign({}, body, { id: `player_${Date.now()}`, score: 0 });
    session.player = player;
    session.gameMode = 'show';

    SocketActions.joinGame(player);
    return res.json(player);
  });

  router.post('/player/name', (req, res) => {
    const name = encodeURIComponent(req.body.name);
    const session = req.session;

    session.player.name = name;
    SocketActions.changePlayerName(session.player.id, name);
    return res.json(session.player);
  });

  router.get('/scoreboard', (req, res) => {
    redis.get('game_state')
      .then(json => {
        return res.json(JSON.parse(json).sockets);
      });
  });

  router.get('/', (req, res) => {
    const session = req.session;
    const gameMode = session.gameMode || 'show';
    session.score = session.score || 0;

    const quote = quoteService.getRandomQuoteForDifficulty(gameMode);
    const player = Object.assign({ id: '', name: '', score: 0 }, session.player, { score: session.score });
    let state = Object.assign({}, initialState, {
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

    redis.get('game_state')
      .then(scoreboard => {
        state = Object.assign({}, state, { scoreboard });
        res.render('guess.html.twig', { state });
      });
  });

  router.post('/answer', (req, res) => {
    const body = req.body;
    const session = req.session;

    if (!body.id) {
      return res.redirect('/game');
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

GameRouter.middleware = ['sessionMiddleware', 'jsonParser'];
GameRouter.dependencies = ['quoteService', 'socketActions', 'redis'];

module.exports = GameRouter;
