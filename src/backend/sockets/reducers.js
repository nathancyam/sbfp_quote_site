const TYPES = require('./types');

module.exports = (initialState = { players: [] }, action) => {
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
