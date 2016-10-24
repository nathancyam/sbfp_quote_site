const TYPES = require('./types');

exports.registrar = function(initialState = {}, action) {
  const { type, payload } = action;

  switch (type) {
    case TYPES.SOCKET_REGISTER: {
      if (!initialState[payload.playerId]) {
        return Object.assign({}, initialState, { [payload.playerId]: payload.socket });
      }
      return initialState;
    }

    case TYPES.GAME_EXIT: {
      const playerId = Object.keys(initialState)
        .filter(key => initialState[key].id === payload.id);

      if (playerId.length === 1) {
        const cloneState = Object.assign({}, initialState);
        delete cloneState[playerId[0]];
        return cloneState;
      }
      return initialState;
    }

    default:
      return initialState;

  }
};

exports.sockets = (initialState = { players: [] }, action) => {
  const { type, payload } = action;

  switch (type) {

    case TYPES.GAME_JOIN: {
      const players = initialState.players;
      const isExistingPlayer = players.find(player => player.id === payload.id);

      if (isExistingPlayer) {
        return initialState;
      }

      const newState = Object.assign({}, initialState);
      newState.players.push(payload);
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

    case TYPES.PLAYER_CHANGE_NAME: {
      const { name, id } = payload;
      const newPlayers = initialState.players.map(player => {
        if (player.id === id) {
          player.name = name;
        }
        return player;
      });

      return Object.assign({}, initialState, newPlayers);
    }

    default: {
      return initialState;
    }
  }
};
