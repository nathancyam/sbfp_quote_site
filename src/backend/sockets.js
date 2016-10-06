const { createStore, combineReducers, bindActionCreators, applyMiddleware } = require('redux');

const TYPES = {
  GAME_JOIN: Symbol('game_join'),
  GAME_EXIT: Symbol('game_exit'),
  GAME_SCORE_POINT: Symbol('game_score_point')
};

const logger = store => next => action => {
  console.dir(action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};

function socketReducers(initialState = { players: [] }, action) {
  const { type, payload } = action;

  switch (type) {

    case TYPES.GAME_JOIN: {
      const players = initialState.players;
      const isExistingPlayer = players.find(player => player.id === payload.id);

      if (isExistingPlayer) {
        return initialState;
      }

      console.log(initialState);
      const newState = Object.assign({}, initialState);
      newState.players.push(payload);
      console.log(newState);
      return newState;
    }

    case TYPES.GAME_EXIT: {
      console.log(action);
      return initialState;
    }

    case TYPES.GAME_SCORE_POINT: {
      const { player, score } = payload;
      const players = initialState.players;
      const updatePlayers = players.map(el => {
        if (el.id === player.id)  {
          return Object.assign({}, el, { score });
        }
        return el;
      });
      return Object.assign({}, initialState, {players: updatePlayers});
    }

    default: {
      return initialState;
    }
  }
}

const store = createStore(
  combineReducers({ sockets: socketReducers }),
  applyMiddleware(logger)
);

function joinGame(player) {
  return {
    type: TYPES.GAME_JOIN,
    payload: player
  };
}

function exitGame(player) {
  return {
    type: TYPES.GAME_EXIT,
    payload: player
  };
}

function scorePoint(player, score) {
  return {
    type: TYPES.GAME_SCORE_POINT,
    payload: {
      player,
      score
    }
  };
}

const Actions = bindActionCreators({
  joinGame,
  exitGame,
  scorePoint
}, store.dispatch);

function AllHandler(io) {
}

function SocketHandler(socket) {

  store.subscribe(() => {
    const state = store.getState();
    socket.emit('game:state_change', state.sockets);
  });

  socket.on('game:score_point', payload => {
    console.log('game:score_point');
    console.log(payload);
    Actions.scorePoint(payload.player, payload.score);
  });

  socket.on('game:join', payload => {
    Actions.joinGame(payload);
  });

  socket.on('game:exit', payload => {
    Actions.exitGame(payload);
  });

  socket.on('disconnect', () => console.log(`User disconnected`));
}

exports.setupSockets = function (io) {
  io.on('connection', socket => {
    AllHandler(io);
    SocketHandler(socket);
  });
};

exports.store = store;
exports.actions = Actions;
